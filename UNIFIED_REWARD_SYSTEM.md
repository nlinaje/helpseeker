# Unified Reward System Architecture

## Overview

The SpectrumSkills platform uses a **unified reward games library** that is shared across ALL therapeutic applications. This means:

- ✅ One centralized game library for the entire platform
- ✅ Games unlocked in any app are immediately available in all other apps
- ✅ Progress (stars, achievements) is shared across all applications
- ✅ Therapists can use multiple apps without managing separate reward systems
- ✅ New games added to the platform automatically become available in all apps

## Architecture Principles

### 1. Single Source of Truth

```swift
// One shared library model used by all apps
public struct RewardGameLibrary {
    public let availableGames: [RewardGame]        // All platform games
    public let unlockedGames: Set<RewardGameID>    // Child's unlocked games
    public let totalStarsEarned: Int               // Cumulative across all apps
}
```

All apps read from and write to the same SwiftData model stored in the shared app group container.

### 2. Cross-App Progress Tracking

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIFIED REWARD PROGRESS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Profile: Max (Age 8)                                                       │
│                                                                             │
│  Total Stars Earned: 247 (cumulative from all apps)                         │
│                                                                             │
│  App Contributions:                                                         │
│  • HelpSeeker:        120 stars (15 scenarios completed)                   │
│  • EmotionExplorer:    85 stars (8 activities completed)                   │
│  • DailyLiving:        42 stars (5 tasks completed)                        │
│                                                                             │
│  Unlocked Games (12 of 20):                                                 │
│  ✅ Letter Match      (unlocked via HelpSeeker)                            │
│  ✅ Number Count      (unlocked via EmotionExplorer)                       │
│  ✅ Sound Match       (unlocked via DailyLiving)                           │
│  ✅ Pattern Game      (unlocked via HelpSeeker)                            │
│  ✅ Memory Match      (unlocked via any app)                               │
│  ...                                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3. Therapist Configuration (Platform-Wide)

Therapists configure rewards **once** for the entire platform, not per app:

```swift
public struct PlatformRewardConfiguration {
    // Which games are enabled (applies to ALL apps)
    public let enabledGames: [RewardGameID]
    
    // How games unlock (applies to ALL apps)
    public let unlockMode: UnlockMode
    
    // Star earning rate (consistent across apps)
    public let starsPerActivity: Int
    
    // Daily limits (enforced in ALL apps)
    public let maxDailyGameTime: TimeInterval?
}
```

## Data Flow

### Unlocking a Game

```
Step 1: Child completes activity in HelpSeeker
        ↓
Step 2: HelpSeeker app adds stars to shared repository
        ↓
Step 3: Repository checks unlock eligibility (checks ALL app progress)
        ↓
Step 4: New game "Sound Matching" is unlocked
        ↓
Step 5: Game is now available in:
        • HelpSeeker (immediately)
        • EmotionExplorer (immediately)
        • DailyLiving (immediately)
        • All other platform apps (immediately)
```

### Code Implementation

```swift
// In any app (HelpSeeker, EmotionExplorer, etc.)
class ActivityCompletionUseCase {
    private let rewardRepository: UnifiedRewardRepositoryPort
    
    func completeActivity(_ activity: Activity) async {
        // 1. Calculate stars for this activity
        let stars = calculateStars(for: activity)
        
        // 2. Add to shared repository (adds to total across ALL apps)
        await rewardRepository.addStars(stars, for: currentProfile.id)
        
        // 3. Check for new unlocks based on cumulative progress
        let newUnlocks = await rewardRepository.checkUnlockEligibility(
            for: currentProfile.id
        )
        
        // 4. Unlock new games in shared library
        for game in newUnlocks {
            await rewardRepository.unlockGame(game.id, for: currentProfile.id)
        }
        
        // 5. Show celebration if new games unlocked
        if !newUnlocks.isEmpty {
            showUnlockCelebration(newUnlocks)
        }
    }
}
```

## Benefits

### For Children
- **Seamless Experience**: Switch between apps without losing rewards
- **Motivation Continuity**: Progress in one app encourages using others
- **No Confusion**: Single reward system to understand

### For Therapists
- **Simplified Management**: Configure rewards once for entire platform
- **Flexibility**: Can use multiple therapeutic apps without reward system overhead
- **Holistic View**: See cumulative progress across all interventions
- **Consistent Incentives**: Same motivational structure regardless of activity type

### For Parents
- **Easy Monitoring**: One place to see all rewards and progress
- **Home Practice**: Rewards earned in therapy are available at home
- **Simplified Setup**: Don't need to configure multiple reward systems

### For Developers
- **Single Implementation**: Build reward system once, use in all apps
- **Easier Maintenance**: Update games in one place, all apps benefit
- **Consistent UX**: Same reward interface across platform

## Technical Implementation

### Shared Data Container

```swift
// All apps read from/write to same SwiftData container
@MainActor
let sharedModelContainer: ModelContainer = {
    let schema = Schema([
        PlatformProfileModel.self,
        UnifiedRewardProgressModel.self,  // Shared reward data
        // ... other models
    ])
    
    let config = ModelConfiguration(
        schema: schema,
        groupContainer: .identifier("group.spectrum-skills") // Shared app group
    )
    
    return try! ModelContainer(for: schema, configurations: [config])
}()
```

### Game Library Distribution

Games are bundled in the **platform-core** Swift package and shared across apps:

```
platform-core/
├── Sources/
│   └── Resources/
│       └── Games/
│           ├── LetterGames/
│           │   ├── LetterMatchGame.swift
│           │   └── LetterTracingGame.swift
│           ├── NumberGames/
│           ├── SoundGames/
│           ├── SpatialGames/
│           ├── LogicGames/
│           └── MemoryGames/
```

All apps link against `platform-core` and automatically have access to the same game library.

### Adding New Games

When a new game is added to the platform:

1. Add game code to `platform-core/Resources/Games/`
2. Update `RewardGameLibrary.loadAllGames()` to include new game
3. Define unlock requirements
4. All apps automatically get the new game on next update
5. No per-app configuration needed

## Configuration Options

### Unlock Modes

**Automatic** (Default):
- Games unlock when child meets requirements
- Requirements based on cumulative stars across all apps
- Example: "Unlock Letter Match after earning 50 total stars"

**Therapist Controlled**:
- Therapist manually unlocks games
- Useful for structured progression
- Example: "Unlock new game only after mastering current skills"

**Progressive**:
- Games unlock in predefined sequence
- Child must unlock Game 1 before Game 2
- Example: "Letter Match → Number Count → Sound Match → ..."

### Per-Game Settings

Therapists can configure each game:

```swift
public struct GameConfiguration {
    public let gameId: RewardGameID
    public let isEnabled: Bool                    // Available to child?
    public let unlockRequirement: UnlockRequirement
    public let maxDailyPlays: Int?                // Optional limit
    public let difficultyAdjustment: Bool         // Auto-adjust by age?
    public let speechRequirement: SpeechRequirement // Speech integration
}

public struct SpeechRequirement {
    public let isEnabled: Bool                    // Require speech?
    public let allowSkip: Bool                    // Can child skip speech?
    public let promptBeforeAction: Bool           // Prompt before each action
    
    public static let `default` = SpeechRequirement(
        isEnabled: true,
        allowSkip: true,
        promptBeforeAction: false
    )
    
    public static let disabled = SpeechRequirement(
        isEnabled: false,
        allowSkip: true,
        promptBeforeAction: false
    )
}
```

### Speech Integration in Games

**All reward games integrate speech practice** - children must say something relevant to the game before completing actions. The therapist can enable/disable this per game or globally.

**Game-Specific Speech Requirements:**

| Game Type | Speech Requirement | Example |
|-----------|-------------------|---------|
| **Memory Match** | Say the card name | "Apple" |
| **Math Games** | Say the answer | "Four" (for 2+2) |
| **Letter Games** | Say the letter/sound | "B" or "Buh" |
| **Number Games** | Say the number | "Twenty-three" |
| **Sound Games** | Say the sound source | "Piano" or "Dog" |
| **Pattern Games** | Say what comes next | "Red circle" |
| **Sorting Games** | Say the category | "Blue" or "Big" |
| **Spatial Games** | Say the position | "Behind" or "Left" |

**Speech Integration Flow:**

```
Child selects card in Memory Game
        ↓
System shows: "🎤 Say the name of this picture!"
        ↓
Child speaks: "Apple"
        ↓
Speech recognition verifies
        ↓
✅ Match → Card flips, child continues
❌ No match → "Try again" or [💡 Hear it]
        ↓
(If allowed) [⏭️ Skip] → Continue without speech
```

**Therapist Control:**
- **Enable/Disable**: Turn speech requirement on/off per game
- **Skip Option**: Allow children to skip speech (for non-verbal or shy children)
- **Global Override**: Disable all speech requirements with one toggle
- **Progressive**: Start with skip allowed, gradually require speech

## User Interface

### Child View

```
┌──────────────────────────────────────────────┐
│  ⭐ Total Stars: 247 (from all your apps!)   │
├──────────────────────────────────────────────┤
│                                              │
│  Your Games (Available Everywhere):          │
│                                              │
│  [🎮 Letter Match]    [🎮 Number Count]     │
│  [🎮 Sound Match]     [🎮 Pattern Game]     │
│  [🔒 Preposition      [🔒 Memory Game]      │
│      Quest]                                  │
│  (Need 10 more ⭐)    (Complete 3 more      │
│                      activities)             │
│                                              │
│  Play these games in any app!                │
└──────────────────────────────────────────────┘
```

### Therapist Configuration View

```
┌─────────────────────────────────────────────────────────────┐
│  Platform-Wide Reward Settings                              │
│  (Applies to ALL SpectrumSkills apps)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Unlock Mode: [Automatic ▼]                                 │
│                                                             │
│  Enabled Games:                                             │
│  ☑ Letter Match (unlocked at 50 ⭐)                         │
│  ☑ Number Count (unlocked at 100 ⭐)                        │
│  ☑ Sound Match (unlocked at 150 ⭐)                         │
│  ☐ Preposition Quest (disabled)                            │
│  ☑ Memory Game (unlocked at 200 ⭐)                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🎤 SPEECH INTEGRATION (All Games)                          │
│                                                             │
│  Require speech in reward games: [✓ Enabled ▼]              │
│                                                             │
│  When enabled, child must say:                              │
│  • Memory: Card name ("Apple")                              │
│  • Math: Answer ("Four")                                    │
│  • Letters: Letter sound ("Buh")                            │
│  • etc.                                                     │
│                                                             │
│  Allow skip option: [✓ Yes ▼]                               │
│  (Child can skip speech if struggling)                      │
│                                                             │
│  [🔧 Configure Per-Game]                                    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Max Daily Play Time: [30 minutes ▼]                        │
│                                                             │
│  [💾 Save] (Applies to all apps)                            │
└─────────────────────────────────────────────────────────────┘
```

### Per-Game Speech Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  🎮 Memory Match - Speech Settings                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Speech Requirement: [✓ Enabled ▼]                          │
│                                                             │
│  Child must say: Card name (e.g., "Apple", "Car")          │
│                                                             │
│  Options:                                                   │
│  ☑ Show visual prompt (microphone icon)                    │
│  ☑ Play sound cue before listening                         │
│  ☑ Allow skip (show skip button)                           │
│  ☐ Require perfect pronunciation                           │
│                                                             │
│  Speech Recognition Sensitivity: [Normal ▼]                 │
│  • Lenient: Accepts partial matches                         │
│  • Normal: Standard recognition                             │
│  • Strict: Requires clear pronunciation                     │
│                                                             │
│  [💾 Save] [🔙 Back to All Games]                           │
└─────────────────────────────────────────────────────────────┘
```

## Migration and Updates

### Adding New Games to Existing Installations

When platform updates add new games:

1. New games appear in library automatically
2. Existing unlocked games remain unlocked
3. New games follow configured unlock requirements
4. Child's total progress applies to new unlocks

Example:
- Child has 300 stars total
- Platform adds new game requiring 250 stars
- Game is automatically unlocked (child already qualifies)

### Backward Compatibility

- Old apps can still access unified library
- Newer games simply won't appear in older app versions
- Progress tracking works regardless of app version
- Updates are non-breaking

## Summary

The unified reward system creates a cohesive platform experience where:

1. **One Library**: All apps access the same educational games
2. **Shared Progress**: Stars and unlocks work across all applications
3. **Therapist Control**: Configure once, apply everywhere
4. **Seamless UX**: Children experience continuity across the platform
5. **Easy Expansion**: New games benefit all apps immediately

This architecture eliminates the complexity of managing separate reward systems while providing a consistent, motivating experience for children across all therapeutic interventions.
