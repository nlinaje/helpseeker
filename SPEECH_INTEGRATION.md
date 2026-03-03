# Speech Integration in Reward Games

## Overview

**All educational reward games in the SpectrumSkills platform integrate speech practice**. This means every time a child plays a reward game, they are also practicing speech and communication skills.

The therapist can enable/disable this feature globally or per-game based on each child's needs and abilities.

## How It Works

### Basic Flow

```
1. Child opens a reward game (e.g., Math Game)
        ↓
2. Child sees a challenge (e.g., "2 + 2 = ?")
        ↓
3. System prompts: "🎤 Say your answer out loud!"
        ↓
4. Child speaks: "Four"
        ↓
5. Speech recognition verifies the answer
        ↓
6a. ✅ Correct: "Great job! 2 + 2 = 4" → Continue playing
6b. ❌ Incorrect: "Try again!" or [💡 Hear the answer] → [⏭️ Skip]
```

## Game-Specific Speech Requirements

### 1. Memory Match Games
**Requirement**: Say the name of the card/picture

**Examples**:
- Card shows: 🍎 Apple
- Child says: "Apple"
- Recognition: ✅ "Apple" matches → Card flips

**Categories**:
- Fruits & Vegetables: "Apple", "Banana", "Carrot"
- Animals: "Dog", "Cat", "Elephant"
- Vehicles: "Car", "Bicycle", "Airplane"
- Household: "House", "Bed", "Table"
- Emotions: "Happy", "Sad", "Angry"

### 2. Math Games
**Requirement**: Say the answer to the math problem

**Examples**:
- Problem: 2 + 2
- Child says: "Four" or "4"
- Recognition: ✅ Matches → Next problem

- Problem: 5 - 3
- Child says: "Two"
- Recognition: ✅ Matches → Next problem

**Operations**:
- Addition: "2 + 3 = Five"
- Subtraction: "5 - 2 = Three"
- Multiplication: "2 × 3 = Six"
- Division: "6 ÷ 2 = Three"

### 3. Letter Games
**Requirement**: Say the letter name or sound

**Examples**:
- Shows: Letter "B"
- Child says: "B" or "Buh"
- Recognition: ✅ Matches → Continue

**Modes**:
- Letter Names: "A", "B", "C"
- Letter Sounds: "Ah", "Buh", "Kuh"
- Phonics: "Buh-ah" (BA)

### 4. Number Games
**Requirement**: Say the number or count

**Examples**:
- Shows: 🔢 23
- Child says: "Twenty-three"
- Recognition: ✅ Matches → Continue

- Shows: 🍎🍎🍎 (3 apples)
- Child says: "Three"
- Recognition: ✅ Matches → Continue

### 5. Sound Games
**Requirement**: Say what made the sound

**Examples**:
- Sound: 🎹 Piano plays
- Child says: "Piano"
- Recognition: ✅ Matches → Continue

- Sound: 🐕 Dog barks
- Child says: "Dog"
- Recognition: ✅ Matches → Continue

### 6. Pattern Games
**Requirement**: Say what comes next in the pattern

**Examples**:
- Pattern: 🔴🔵🔴🔵🔴?
- Child says: "Blue circle"
- Recognition: ✅ Matches → Continue

- Pattern: 2, 4, 6, 8, ?
- Child says: "Ten"
- Recognition: ✅ Matches → Continue

### 7. Sorting Games
**Requirement**: Say the category or attribute

**Examples**:
- Task: Sort by color
- Child moves item to 🔵
- Child says: "Blue"
- Recognition: ✅ Matches → Continue

- Task: Sort by size
- Child moves item to "Big"
- Child says: "Big"
- Recognition: ✅ Matches → Continue

### 8. Spatial Games
**Requirement**: Say the position or direction

**Examples**:
- Task: Put ball ___ box (behind)
- Child says: "Behind"
- Recognition: ✅ Matches → Continue

- Task: Move left/right
- Child says: "Left"
- Recognition: ✅ Matches → Continue

## Therapist Configuration

### Global Settings (Affects ALL Games)

**Enable/Disable Speech**:
```
🎤 Speech in Reward Games: [✓ Enabled ▼]

Options:
• Enabled: All games require speech
• Disabled: No games require speech
• Per-Game: Configure individually
```

**Allow Skip Option**:
```
Allow children to skip speech: [✓ Yes ▼]

When enabled:
• Child sees [⏭️ Skip] button
• Can continue without speaking
• Useful for non-verbal children
• Useful when child is struggling
```

### Per-Game Settings

Each game can be configured individually:

```
🎮 Memory Match - Speech Settings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Speech Requirement: [✓ Enabled ▼]

What child must say:
• Card name (e.g., "Apple", "Car")

Options:
☑ Show visual prompt (microphone icon)
☑ Play sound cue before listening
☑ Allow skip button
☐ Require perfect pronunciation

Speech Sensitivity: [Normal ▼]
• Lenient: Accepts similar sounds
• Normal: Standard recognition
• Strict: Requires clear speech

[💾 Save Settings]
```

### Progressive Speech Training

Therapists can gradually increase speech requirements:

**Week 1-2: Introduction**
- Speech enabled
- Skip button always available
- Lenient recognition
- Goal: Get comfortable speaking

**Week 3-4: Building Confidence**
- Speech enabled
- Skip button available but less prominent
- Normal recognition
- Goal: Try speaking before skipping

**Week 5+: Mastery**
- Speech enabled
- Skip button only after 2 attempts
- Strict recognition
- Goal: Speak clearly and confidently

## Accessibility & Inclusion

### For Non-Verbal Children

When speech is disabled:
- ✅ All games work normally
- ✅ Tap to select/answer
- ✅ Visual feedback only
- ✅ No speech prompts
- ✅ Full game access

### For Children with Speech Difficulties

**Lenient Recognition Mode**:
- Accepts partial matches
- Similar sounds accepted
- Example: "App-uh" accepted for "Apple"
- Builds confidence without frustration

**Visual Support**:
- Microphone icon shows when listening
- Waveform animation indicates speech detected
- Clear visual feedback (✅/❌)
- Optional text hints

### For Shy or Anxious Children

**Gradual Exposure**:
1. Start with skip always available
2. Praise any attempt at speech
3. Gradually reduce skip prominence
4. Celebrate successful recognition

**Private Practice**:
- No recording stored
- No judgment or scores for speech quality
- Safe environment to practice
- Can practice alone without therapist watching

## Technical Implementation

### Speech Recognition Flow

```swift
// GameGameplay.swift
func handleGameAction() {
    // 1. Show game challenge
    showChallenge()
    
    // 2. Check if speech is required
    if speechConfiguration.isEnabled {
        // 3. Prompt for speech
        showSpeechPrompt("Say your answer!")
        
        // 4. Start listening
        speechRecognizer.startListening()
        
        // 5. Wait for speech or timeout
        let result = await speechRecognizer.recognize(timeout: 5.0)
        
        // 6. Verify speech
        switch verifySpeech(result, expected: correctAnswer) {
        case .match:
            showSuccess()
            continueGame()
        case .noMatch:
            showTryAgain()
            offerSkipIfAllowed()
        case .timeout:
            showTimeoutMessage()
            offerSkipIfAllowed()
        }
    } else {
        // Speech disabled - continue normally
        continueGame()
    }
}
```

### Configuration Data Model

```swift
public struct SpeechConfiguration {
    public let isEnabled: Bool
    public let allowSkip: Bool
    public let sensitivity: SpeechSensitivity
    public let maxAttempts: Int?
    
    public enum SpeechSensitivity {
        case lenient      // Accepts partial matches
        case normal       // Standard recognition
        case strict       // Requires clear pronunciation
    }
}

// Per-game configuration
public struct GameSpeechSettings {
    public let gameId: RewardGameID
    public let configuration: SpeechConfiguration
    public let promptText: LocalizedString  // "Say the card name"
}
```

## Benefits

### Therapeutic Value
1. **Speech Practice**: Every game becomes speech therapy
2. **Vocabulary Building**: Learn words through repetition
3. **Confidence**: Safe environment to practice speaking
4. **Generalization**: Transfer skills from therapy to games
5. **Motivation**: Games make speech practice fun

### Educational Value
1. **Reinforcement**: Saying answer reinforces learning
2. **Memory**: Verbalizing improves retention
3. **Multimodal**: Visual + auditory + speech = better learning
4. **Engagement**: Speech adds interactivity

### Practical Value
1. **No Extra Time**: Speech practice built into play time
2. **Automatic**: No setup required each session
3. **Trackable**: Monitor speech attempts and success
4. **Flexible**: Easy to adjust based on child's needs

## Examples by Age Group

### Ages 6-7 (Beginner)
**Memory Game**: "Apple" (simple words)
**Math**: "3" (single numbers)
**Letters**: "B" (letter names)

### Ages 8-9 (Intermediate)
**Memory Game**: "Watermelon" (longer words)
**Math**: "Fourteen" (teen numbers)
**Letters**: "Buh" (letter sounds)

### Ages 10-12 (Advanced)
**Memory Game**: "Refrigerator" (complex words)
**Math**: "Twenty-seven" (complex numbers)
**Patterns**: "Yellow triangle" (multi-word responses)

## Summary

**Speech integration makes every reward game a therapeutic opportunity.** Children practice speech naturally while playing, with full therapist control over when and how speech is required. The feature is inclusive - it enhances the experience for verbal children while remaining fully accessible to non-verbal children when disabled.

**Key Points**:
- ✅ All games integrate speech by default
- ✅ Therapist can disable globally or per-game
- ✅ Skip option available when needed
- ✅ Multiple recognition sensitivity levels
- ✅ Works for all ages and abilities
- ✅ No extra setup or configuration required
