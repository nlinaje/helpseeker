# Platform Architecture & Branding Guide

## Overview

This document outlines the technical architecture and brand identity for the therapeutic platform. HelpSeeker is the first application in a suite of evidence-based therapeutic tools for children with autism.

---

## Platform Vision

### Mission
Empower children with autism to develop life skills through evidence-based, engaging therapeutic applications that grow with them.

### Core Principles

1. **Evidence-Based**: Every intervention backed by peer-reviewed research
2. **Child-Centered**: Designed specifically for neurodivergent minds
3. **Unified Experience**: Consistent companion character and design across all apps
4. **Privacy First**: Local data storage, no external communication
5. **Inclusive**: Multilingual, accessible, culturally sensitive
6. **Open Source**: AGPLv3 code, CC0 assets, community-driven

---

## Brand Identity

### Platform Name: **SpectrumSkills**

**Rationale**:
- Embraces neurodiversity positively
- "Spectrum" acknowledges autism without stigma
- "Skills" emphasizes growth and capability
- Works across languages: SpektrumFähigkeiten (DE), Habilidades del Espectro (ES)
- Modern, professional, warm

### Alternative Options
- **NeuroNurture** (if emphasizing care/growth)
- **EmpowerKids** (if emphasizing independence)
- **Connect+Learn** (if emphasizing communication)

### Logo Concept

**Design Elements**:
- **Primary Icon**: Abstract, friendly geometric character
  - Simple shapes (circle + basic features)
  - Expressive without being overwhelming
  - Works at small (app icon) and large sizes
  
**Color Palette**:
```css
/* Primary */
--calm-blue: #4A90D9;      /* Trust, stability, calm */
--growth-green: #7CB342;   /* Progress, success, nature */

/* Secondary */
--warm-orange: #FF9800;    /* Energy, celebration, attention */
--soft-purple: #9C27B0;    /* Creativity, imagination */

/* Neutrals */
--light-gray: #F5F5F5;     /* Backgrounds */
--medium-gray: #9E9E9E;    /* Secondary text */
--dark-gray: #424242;      /* Primary text */

/* Accessibility */
--high-contrast-blue: #0066CC;
--high-contrast-yellow: #FFD700;
```

**Typography**:
- **Headings**: San Francisco (iOS system font) - clean, accessible
- **Body**: San Francisco - consistent, native feel
- **Alternative for materials**: Open Sans (web version)

### Character Design System

**Universal Companion Character**:
- **Name**: Customizable by child (default: "Buddy")
- **Gender**: Neutral/customizable
- **Base Forms**: 4 types
  1. **Animal**: Friendly fox, bear, or rabbit
  2. **Robot**: Rounded, expressive robot
  3. **Fantasy**: Small dragon or friendly monster
  4. **Abstract**: Simple geometric shape with personality

**Character System**:
- Appears in ALL platform apps
- Maintains name and appearance across apps
- Learns/grows with child
- Shows emotions matching app context
- Celebrates achievements with child

**Outfit System**:
- Unlockable accessories (hats, glasses, etc.)
- Earned through progress in any app
- Visible in all apps

---

## Platform Architecture

### Repository Structure

```
spectrum-skills/ (GitHub Organization)
│
├── README.md                    # Platform overview
├── LICENSE                      # AGPLv3
├── CONTRIBUTING.md              # Contribution guidelines
├──
├── platform-core/               # Shared infrastructure
│   ├── Package.swift
│   ├── Sources/
│   │   ├── Domain/             # Core business logic
│   │   │   ├── Entities/
│   │   │   ├── ValueObjects/
│   │   │   └── Events/
│   │   ├── Infrastructure/
│   │   │   ├── Persistence/
│   │   │   ├── Speech/
│   │   │   └── Content/
│   │   └── SharedUI/
│   │       ├── Components/
│   │       ├── DesignSystem/
│   │       └── Accessibility/
│   └── Tests/
│
├── apps/                        # Individual applications
│   ├── help-seeker/            # App 1: Help-seeking skills
│   │   ├── HelpSeeker.xcodeproj
│   │   ├── Sources/
│   │   ├── Resources/
│   │   └── Tests/
│   │
│   ├── emotion-explorer/       # App 2: Emotional regulation
│   ├── daily-living/           # App 3: Self-care skills
│   ├── social-stories/         # App 4: Social understanding
│   ├── play-partner/           # App 5: Play skills
│   ├── schedule-mate/          # App 6: Visual schedules
│   └── communicator/           # App 7: AAC
│
├── assets/                      # CC0 shared assets
│   ├── characters/
│   │   ├── base/
│   │   ├── expressions/
│   │   └── outfits/
│   ├── sounds/
│   └── fonts/
│
├── content/                     # Shared content
│   ├── scenarios/              # Help-seeking scenarios
│   ├── social-stories/         # Social story templates
│   ├── schedules/              # Schedule templates
│   └── translations/           # Localization files
│
├── documentation/
│   ├── research/               # Evidence summaries
│   ├── design/                 # UI/UX guidelines
│   ├── architecture/           # Technical docs
│   └── content-guidelines/     # Content creation guide
│
└── tools/
    ├── content-validator/      # Validate JSON content
    ├── asset-generator/        # Generate character variations
    └── localization-manager/   # Translation workflow
```

### Technical Architecture

#### Core Framework (platform-core)

```swift
// Package.swift
import PackageDescription

let package = Package(
    name: "SpectrumSkillsCore",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "SpectrumDomain", targets: ["SpectrumDomain"]),
        .library(name: "SpectrumInfrastructure", targets: ["SpectrumInfrastructure"]),
        .library(name: "SpectrumUI", targets: ["SpectrumUI"]),
    ],
    targets: [
        // Domain layer - pure Swift, no dependencies
        .target(name: "SpectrumDomain"),
        
        // Infrastructure layer - adapters
        .target(
            name: "SpectrumInfrastructure",
            dependencies: ["SpectrumDomain"]
        ),
        
        // Shared UI components
        .target(
            name: "SpectrumUI",
            dependencies: ["SpectrumDomain", "SpectrumInfrastructure"]
        ),
    ]
)
```

#### Domain Layer (platform-core/Sources/Domain)

**Universal Character Entity**:
```swift
// Character.swift
public struct CompanionCharacter: Identifiable, Codable {
    public let id: CharacterID
    public let baseType: CharacterType
    public let name: String
    public let appearance: AppearanceConfig
    public let unlockedOutfits: Set<OutfitID>
    public let currentExpression: CharacterExpression
    
    public init(
        id: CharacterID,
        baseType: CharacterType,
        name: String,
        appearance: AppearanceConfig
    ) {
        self.id = id
        self.baseType = baseType
        self.name = name
        self.appearance = appearance
        self.unlockedOutfits = []
        self.currentExpression = .neutral
    }
}

public enum CharacterType: String, Codable, CaseIterable {
    case animal = "animal"
    case robot = "robot"
    case fantasy = "fantasy"
    case abstract = "abstract"
}

public enum CharacterExpression: String, Codable {
    case neutral = "neutral"
    case happy = "happy"
    case celebrating = "celebrating"
    case confused = "confused"
    case sad = "sad"
    case excited = "excited"
    case thinking = "thinking"
}
```

**Platform Profile**:
```swift
// PlatformProfile.swift
public struct PlatformProfile: Identifiable, Codable {
    public let id: ProfileID
    public let childName: String
    public let age: Int
    public let character: CompanionCharacter
    public let installedApps: [AppType]
    public let universalProgress: UniversalProgress
    public let preferences: PlatformPreferences
    
    public init(
        id: ProfileID,
        childName: String,
        age: Int,
        character: CompanionCharacter
    ) {
        self.id = id
        self.childName = childName
        self.age = age
        self.character = character
        self.installedApps = []
        self.universalProgress = UniversalProgress()
        self.preferences = PlatformPreferences()
    }
}

public enum AppType: String, Codable, CaseIterable {
    case helpSeeker = "help_seeker"
    case emotionExplorer = "emotion_explorer"
    case dailyLiving = "daily_living"
    case socialStories = "social_stories"
    case playPartner = "play_partner"
    case scheduleMate = "schedule_mate"
    case communicator = "communicator"
}
```

**Universal Progress**:
```swift
// UniversalProgress.swift
public struct UniversalProgress: Codable {
    public var communicationSkills: SkillProgress
    public var emotionalRegulation: SkillProgress
    public var dailyLiving: SkillProgress
    public var socialSkills: SkillProgress
    public var cognitiveSkills: SkillProgress
    public var totalSessionsCompleted: Int
    public var totalRewardsUnlocked: Int
    
    public init() {
        self.communicationSkills = SkillProgress()
        self.emotionalRegulation = SkillProgress()
        self.dailyLiving = SkillProgress()
        self.socialSkills = SkillProgress()
        self.cognitiveSkills = SkillProgress()
        self.totalSessionsCompleted = 0
        self.totalRewardsUnlocked = 0
    }
}

public struct SkillProgress: Codable {
    public var level: SkillLevel
    public var sessionsCompleted: Int
    public var achievements: [AchievementID]
    
    public init() {
        self.level = .beginner
        self.sessionsCompleted = 0
        self.achievements = []
    }
}

public enum SkillLevel: String, Codable {
    case beginner = "beginner"
    case developing = "developing"
    case proficient = "proficient"
    case advanced = "advanced"
}
```

#### Infrastructure Layer

**SwiftData Models**:
```swift
// PlatformProfileModel.swift
import SwiftData

@Model
public final class PlatformProfileModel {
    @Attribute(.unique) public var id: UUID
    public var childName: String
    public var age: Int
    public var characterType: String
    public var characterName: String
    public var installedApps: [String]
    
    public init(from profile: PlatformProfile) {
        self.id = profile.id.value
        self.childName = profile.childName
        self.age = profile.age
        self.characterType = profile.character.baseType.rawValue
        self.characterName = profile.character.name
        self.installedApps = profile.installedApps.map { $0.rawValue }
    }
}
```

**Cross-App Repository**:
```swift
// PlatformProfileRepository.swift
public protocol PlatformProfileRepositoryPort {
    func createProfile(_ profile: PlatformProfile) async throws
    func fetchProfile(id: ProfileID) async throws -> PlatformProfile?
    func updateProfile(_ profile: PlatformProfile) async throws
    func installApp(_ appType: AppType, for profileId: ProfileID) async throws
    func updateProgress(_ progress: UniversalProgress, for profileId: ProfileID) async throws
}
```

#### Shared UI Components

**Character View**:
```swift
// CharacterView.swift
public struct CharacterView: View {
    let character: CompanionCharacter
    let size: CharacterSize
    let animated: Bool
    
    public var body: some View {
        Image(character.currentImageName)
            .resizable()
            .scaledToFit()
            .frame(width: size.dimension, height: size.dimension)
            .accessibilityLabel("\(character.name) showing \(character.currentExpression) expression")
    }
}

public enum CharacterSize {
    case tiny, small, medium, large, fullScreen
    
    var dimension: CGFloat {
        switch self {
        case .tiny: return 40
        case .small: return 80
        case .medium: return 150
        case .large: return 250
        case .fullScreen: return 400
        }
    }
}
```

**Celebration Animation**:
```swift
// CelebrationView.swift
public struct CelebrationView: View {
    let character: CompanionCharacter
    let message: String
    let onComplete: () -> Void
    
    public var body: some View {
        VStack {
            CharacterView(character: character, size: .large, animated: true)
                .celebrationAnimation()
            
            Text(message)
                .font(.title)
                .multilineTextAlignment(.center)
                .padding()
        }
    }
}
```

**Reward Games Menu**:
```swift
// RewardGamesMenuView.swift
public struct RewardGamesMenuView: View {
    @State private var selectedCategory: GameCategory?
    let availableGames: [RewardGame]
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))]) {
                    ForEach(GameCategory.allCases) { category in
                        CategoryCard(category: category, games: gamesFor(category))
                    }
                }
            }
            .navigationTitle("Educational Games")
        }
    }
}
```

### Individual App Structure

Each app follows the same pattern:

```swift
// App-specific domain
public struct HelpSeekerScenario: Identifiable {
    let id: ScenarioID
    let category: ScenarioCategory
    let difficulty: DifficultyLevel
    let content: LocalizedContent
}

// App-specific infrastructure
public final class HelpSeekerRepository: HelpSeekerRepositoryPort {
    // Implementation
}

// App-specific UI
public struct HelpSeekerView: View {
    @StateObject private var viewModel: HelpSeekerViewModel
    
    var body: some View {
        // App-specific UI using shared components
    }
}
```

---

## App Ecosystem

### HelpSeeker (Released First)
**Focus**: Asking for help
**Evidence**: Functional communication training, DTT
**Availability**: Completely free, open source (AGPLv3)

### EmotionExplorer
**Focus**: Emotional identification and regulation
**Evidence**: Zones of Regulation, CBT adaptations
**Availability**: Completely free, open source (AGPLv3)

### DailyLiving
**Focus**: Self-care skills (dressing, grooming, hygiene)
**Evidence**: Task analysis, chaining, video modeling
**Availability**: Completely free, open source (AGPLv3)

### SocialStories
**Focus**: Social understanding
**Evidence**: Social Stories™ by Carol Gray
**Availability**: Completely free, open source (AGPLv3)

### PlayPartner
**Focus**: Play skills and turn-taking
**Evidence**: Video modeling, peer-mediated intervention
**Availability**: Completely free, open source (AGPLv3)

### ScheduleMate
**Focus**: Visual schedules and transitions
**Evidence**: TEACCH structured teaching
**Availability**: Completely free, open source (AGPLv3)

### Communicator
**Focus**: AAC and communication building
**Evidence**: PECS
**Availability**: Completely free, open source (AGPLv3)

### SequenceBuilder (NEW)
**Focus**: Visual sequencing and task ordering
**Evidence**: TEACCH work systems, task analysis, visual schedules
**Features**:
- **Visual Sequences**: Order pictograms to complete daily routines (bedtime, morning routine, getting ready, etc.)
- **Custom Scenarios**: Therapist creates custom sequences with pictograms
- **Multiple Valid Orders**: Accepts different correct sequences when applicable
- **Speech Integration**: Child says each step aloud before moving to next
- **Step-by-Step Guidance**: Visual and audio prompts for each step
- **Real-World Connection**: Practice sequences before doing them in real life
- **Progress Tracking**: Track mastery of different sequences
**Therapist Features**:
- Create custom sequences with pictogram library
- Upload custom photos for personalized sequences
- Define correct order(s) - single or multiple valid sequences
- Set difficulty (number of steps, complexity)
- Add audio prompts for each step
**Examples**:
- Bedtime routine: Change clothes → Brush teeth → Read book → Lights off → Good night
- Morning routine: Wake up → Get dressed → Eat breakfast → Brush teeth → Go to school
- Washing hands: Turn on water → Wet hands → Soap → Rub → Rinse → Dry → Turn off
**Availability**: Completely free, open source (AGPLv3)

---

## Unified Educational Reward Games Library

### Platform-Wide Reward System

**Core Principle**: All therapeutic applications in the SpectrumSkills platform share a **single, unified reward games library**. This means:

- ✅ **One Reward Library**: All apps access the same educational games
- ✅ **Cross-App Progress**: Games unlocked in one app are available in all apps
- ✅ **Unified Unlocking**: Progress in any app contributes to unlocking new games
- ✅ **Therapist Control**: Therapist decides which apps and scenarios to use; rewards work seamlessly across all
- ✅ **No App-Specific Rewards**: New games added to the platform are automatically available to all applications

### How It Works

```
Child plays HelpSeeker scenario → Earns stars → Unlocks "Letter Match" game
                                                      ↓
Child plays EmotionExplorer activity → More stars → "Letter Match" already unlocked
                                                      ↓
Child plays DailyLiving task → Even more stars → Unlocks "Sound Matching" game
                                                      ↓
New platform update adds "Pattern Game" → Available in ALL apps immediately
```

### Game Categories (Platform-Wide Library)

**1. LetterGames**
- Letter recognition
- Tracing practice
- Word building
- Phonics

**2. NumberGames**
- Counting
- Basic operations
- Number patterns
- Comparisons (more/less)

**3. SoundGames**
- Instrument identification
- Animal sounds
- Environmental sounds
- Sound matching

**4. SpatialGames**
- Prepositions (in front, behind, below)
- Left/right concepts
- Size ordering
- Direction following

**5. LogicGames**
- Pattern completion
- Sorting by attributes
- Simple mazes
- Cause and effect

**6. MemoryGames**
- Matching pairs
- Sequence recall
- What's missing?

**7. Memory Match with Speech**
- Classic memory game with speech integration
- Child must say the name of each flipped image out loud
- Combines memory skills with vocabulary and speech practice
- Speech recognition verifies pronunciation
- Skip option available for non-verbal children
- Categories: Fruits/Vegetables, Animals, Vehicles, Household items, Emotions

**8. Additional Games** (Future)
- New games added to the platform library automatically become available in all apps
- Community-contributed games
- Research-backed educational games

### Speech Integration in All Games (Configurable)

**Core Feature**: Every reward game integrates speech practice - children must say answers, names, or responses out loud before completing game actions. This transforms play time into speech therapy time!

**Game-Specific Speech Requirements:**

| Game Type | What Child Must Say | Example |
|-----------|-------------------|---------|
| **LetterGames** | Letter name or sound | "B" or "Buh" |
| **NumberGames** | Number or answer | "Twenty-three" or "Five" |
| **SoundGames** | Sound source name | "Piano" or "Dog" |
| **SpatialGames** | Position/direction | "Behind" or "Left" |
| **LogicGames** | Answer or category | "Red circle" or "Blue" |
| **MemoryGames** | Card name | "Apple" or "Car" |

**Speech Integration Flow:**
```
Child plays game → Sees challenge (e.g., "2 + 2")
                        ↓
              System prompts: "🎤 Say your answer!"
                        ↓
              Child speaks: "Four"
                        ↓
              Speech recognition verifies
                        ↓
            ✅ Match → Continue playing
            ❌ No match → "Try again" or [💡 Hear it]
                        ↓
              (If enabled) [⏭️ Skip] → Continue without speech
```

**Therapist Configuration:**
- **Global Toggle**: Enable/disable speech for ALL games with one setting
- **Per-Game Control**: Configure speech requirement individually per game
- **Skip Option**: Allow children to skip speech (for non-verbal, shy, or struggling children)
- **Progressive Mode**: Start with skip allowed, gradually require speech as confidence builds
- **Recognition Sensitivity**: Lenient/Normal/Strict matching

**Non-Verbal Friendly:**
When speech is disabled, all games work seamlessly without voice input - ensuring every child can enjoy and benefit from the reward games regardless of speech ability.

### Age Adaptation

**Ages 6-7**:
- Letters A-Z
- Numbers 1-20
- Basic colors/shapes
- Simple patterns
- Single-step directions

**Ages 8-9**:
- Word families
- Addition/subtraction
- Complex patterns
- Spatial terms
- Multi-step directions

**Ages 10-12**:
- Multiplication/division concepts
- Fractions
- Advanced logic
- Complex spatial reasoning
- Abstract patterns

---

## Data Architecture

### Privacy-First Design

```swift
// Local Data Only
public protocol LocalDataRepository {
    // All data stored on device
    // No cloud sync
    // No external APIs
}

// Data Export (for therapists)
public protocol DataExportPort {
    func exportProgress(for profileId: ProfileID) async throws -> Data
    // CSV/JSON format
    // Parent/therapist controlled
}

// Comprehensive Data Export/Import (for device transfer)
public protocol DataTransferPort {
    func exportAllData(for profileId: ProfileID) async throws -> URL
    // Returns path to .spectrum backup file (ZIP format)
    // Contains: SwiftData database + Assets + Configuration
    
    func importData(from url: URL) async throws -> ImportResult
    // Imports from .spectrum backup file
    // Validates and merges data
    
    func validateImportFile(at url: URL) async throws -> ImportValidation
    // Checks file integrity and compatibility
}

public struct ImportResult {
    public let success: Bool
    public let profilesImported: [ProfileID]
    public let errors: [ImportError]
    public let warnings: [ImportWarning]
}

public enum ImportError: Error {
    case invalidFileFormat
    case incompatibleVersion
    case corruptedData
    case insufficientStorage
    case duplicateProfiles
}
```

### Comprehensive Data Export/Import System

**Purpose**: Enable data portability between devices, backup creation, and future web platform integration while maintaining privacy-first principles.

#### Export File Format (.spectrum)

The export creates a `.spectrum` file (ZIP archive) containing:

```
max_schmidt_20260210.spectrum (ZIP file)
├── 📁 metadata/
│   └── export_info.json       # Export timestamp, app version, platform info
├── 📁 profiles/
│   ├── profile_data.json      # All profile information
│   ├── character_config.json  # Character customization
│   └── preferences.json       # App settings and preferences
├── 📁 progress/
│   ├── scenario_attempts.json # All scenario completion data
│   ├── game_progress.json     # Reward game progress
│   └── achievements.json      # Unlocked achievements
├── 📁 sessions/
│   └── therapy_sessions.json  # Planned and completed sessions
├── 📁 custom_content/
│   ├── custom_scenarios/      # Therapist-created scenarios
│   ├── custom_sequences/      # SequenceBuilder custom sequences
│   └── uploaded_photos/       # User-uploaded images
└── 📁 assets/
    └── character_outfits/     # Unlocked outfits and accessories
```

#### Export Modes

**1. Full Export** (All Data)
```swift
// Export everything for complete device transfer
let exportURL = try await dataTransfer.exportAllData(
    for: profileId,
    mode: .full
)
// Creates: max_schmidt_20260210.spectrum (~5-15 MB)
```

**2. Progress Only** (No Media)
```swift
// Export progress data without photos/media
let exportURL = try await dataTransfer.exportAllData(
    for: profileId,
    mode: .progressOnly
)
// Creates: max_schmidt_progress_20260210.spectrum (~50-200 KB)
```

**3. CSV Export** (Reports)
```swift
// Export for analysis and IEP meetings
let csvData = try await dataExport.exportProgress(
    for: profileId,
    format: .csv,
    dateRange: lastMonth
)
// Creates: max_progress_feb2026.csv
```

#### Import Process

**Validation Steps**:
1. **File Integrity**: Check ZIP structure and checksums
2. **Version Compatibility**: Ensure app version supports file format
3. **Storage Check**: Verify sufficient space for import
4. **Conflict Detection**: Check for duplicate profiles

**Import Options**:
```swift
public enum ImportStrategy {
    case replace        // Replace existing data with import
    case merge          // Merge import with existing (smart conflict resolution)
    case duplicate      // Create new profile from import
}

// Import with user choice
let result = try await dataTransfer.importData(
    from: fileURL,
    strategy: .merge
)
```

**Merge Logic**:
- Same profile ID → Update with newest data
- Different profile ID → Add as new profile
- Conflicting data → Present options to user
- Missing assets → Flag for re-upload

#### Use Cases

**Case 1: iPad to iPad Transfer**
```
Child gets new iPad
        ↓
Old iPad: Export data → max_backup.spectrum
        ↓
AirDrop / Email / Cloud storage
        ↓
New iPad: Import max_backup.spectrum
        ↓
All progress, characters, settings restored!
```

**Case 2: Therapist Share**
```
Therapist creates custom scenarios
        ↓
Export: scenarios_only.spectrum
        ↓
Email to parent
        ↓
Parent imports → Custom scenarios available!
```

**Case 3: Backup Before Update**
```
Before major iOS update
        ↓
Export full backup
        ↓
Save to iCloud / Computer
        ↓
If something goes wrong → Restore from backup
```

**Case 4: Web Platform (Future)**
```
Child uses iPad at home
        ↓
Export to web platform
        ↓
Therapist reviews progress on web dashboard
        ↓
Creates new scenarios on web
        ↓
Child imports on iPad
        ↓
New content available!
```

#### Security & Privacy

**Encryption**:
- Optional password protection for exports
- AES-256 encryption for sensitive data
- Therapist can require encryption for exports

**Privacy Controls**:
```swift
public struct ExportPrivacySettings {
    public let includePhotos: Bool          // Include uploaded images?
    public let includeAudio: Bool           // Include voice recordings?
    public let includeTherapistNotes: Bool  // Include session notes?
    public let anonymize: Bool              // Remove identifying info?
    public let passwordProtection: String?  // Optional encryption password
}
```

**Audit Trail**:
- Log all export/import operations
- Track data movement between devices
- Compliant with GDPR/CCPA data portability requirements

#### Implementation Example

```swift
// Export ViewModel
class DataExportViewModel: ObservableObject {
    @Published var exportProgress: Double = 0.0
    @Published var exportStatus: ExportStatus = .idle
    
    func exportProfileData(profileId: ProfileID, mode: ExportMode) async {
        exportStatus = .preparing
        
        do {
            // Step 1: Gather data
            exportStatus = .collectingData
            let profile = try await repository.fetchProfile(id: profileId)
            let progress = try await repository.fetchProgress(for: profileId)
            let sessions = try await repository.fetchSessions(for: profileId)
            
            // Step 2: Create export package
            exportStatus = .packaging
            let exporter = DataPackageExporter()
            let exportURL = try await exporter.createExport(
                profile: profile,
                progress: progress,
                sessions: sessions,
                mode: mode
            ) { progress in
                self.exportProgress = progress
            }
            
            exportStatus = .completed(exportURL)
            
            // Step 3: Present share sheet
            presentShareSheet(for: exportURL)
            
        } catch {
            exportStatus = .failed(error)
        }
    }
}

// Import ViewModel
class DataImportViewModel: ObservableObject {
    @Published var importPreview: ImportPreview?
    @Published var importResult: ImportResult?
    
    func previewImport(from url: URL) async {
        do {
            let validator = ImportValidator()
            let preview = try await validator.previewImport(at: url)
            self.importPreview = preview
        } catch {
            showError(error)
        }
    }
    
    func executeImport(from url: URL, strategy: ImportStrategy) async {
        do {
            let result = try await dataTransfer.importData(
                from: url,
                strategy: strategy
            )
            self.importResult = result
            
            if result.success {
                showSuccess("Imported \(result.profilesImported.count) profiles")
            }
        } catch {
            showError(error)
        }
    }
}
```

#### UI Flow

**Export Flow**:
1. User selects "Export Data" from settings
2. Choose export mode (Full / Progress Only / Custom)
3. Configure privacy settings
4. Optional: Set password protection
5. System creates `.spectrum` file
6. Present share sheet (AirDrop, Email, Save to Files, etc.)

**Import Flow**:
1. User selects "Import Data" from settings
2. File picker to select `.spectrum` file
3. System validates file
4. Show preview: "This will import:"
   - 1 profile: Max (Age 8)
   - 45 scenarios completed
   - 12 custom sequences
   - Last activity: Feb 10, 2026
5. User chooses import strategy (Replace / Merge / Duplicate)
6. Execute import with progress bar
7. Show result and any warnings

#### Future Web Platform Integration

The `.spectrum` file format is designed for future web platform compatibility:

```javascript
// Web platform JavaScript (future)
async function importSpectrumFile(file) {
    const zip = await JSZip.loadAsync(file);
    
    // Extract metadata
    const metadata = JSON.parse(
        await zip.file('metadata/export_info.json').async('text')
    );
    
    // Validate version
    if (!isCompatibleVersion(metadata.appVersion)) {
        throw new Error('Incompatible file version');
    }
    
    // Extract and display progress data
    const progress = JSON.parse(
        await zip.file('progress/scenario_attempts.json').async('text')
    );
    
    // Display on web dashboard
    displayProgressChart(progress);
}
```

This enables:
- Therapists reviewing progress on web dashboard
- Parents viewing reports on any device
- Data synchronization between iPad and web
- Cloud backup without compromising privacy

### Cross-App Data Sharing

```swift
// Shared container for app group
let sharedContainer = FileManager.default
    .containerURL(forSecurityApplicationGroupIdentifier: "group.spectrum-skills")

// SwiftData store in shared location
@MainActor
let sharedModelContainer: ModelContainer = {
    let schema = Schema([
        PlatformProfileModel.self,
        UniversalProgressModel.self,
        // Shared models
    ])
    
    let config = ModelConfiguration(
        schema: schema,
        isStoredInMemoryOnly: false,
        groupContainer: .identifier("group.spectrum-skills")
    )
    
    return try! ModelContainer(for: schema, configurations: [config])
}()
```

### Unified Reward System Implementation

**Shared Reward Library Model**:
```swift
// Domain Layer - Shared across all apps
public struct RewardGameLibrary: Codable {
    public let availableGames: [RewardGame]
    public let unlockedGames: Set<RewardGameID>
    public let totalStarsEarned: Int
    
    public init() {
        self.availableGames = RewardGameLibrary.loadAllGames()
        self.unlockedGames = []
        self.totalStarsEarned = 0
    }
    
    // Load all games from platform library (not app-specific)
    private static func loadAllGames() -> [RewardGame] {
        // Load from shared platform bundle
        // All apps see the same game library
        return PlatformContentRepository.loadRewardGames()
    }
}

public struct RewardGame: Identifiable, Codable {
    public let id: RewardGameID
    public let title: LocalizedString
    public let category: GameCategory
    public let unlockRequirement: UnlockRequirement
    public let isEnabled: Bool
    
    public init(
        id: String,
        title: LocalizedString,
        category: GameCategory,
        unlockRequirement: UnlockRequirement
    ) {
        self.id = RewardGameID(value: id)
        self.title = title
        self.category = category
        self.unlockRequirement = unlockRequirement
        self.isEnabled = true
    }
}

public enum UnlockRequirement: Codable {
    case starsEarned(count: Int)           // Total stars across all apps
    case scenariosCompleted(count: Int)    // Any app scenarios
    case specificActivity(app: AppType, count: Int) // App-specific milestone
    case achievement(AchievementID)        // Any platform achievement
}
```

**Cross-App Reward Tracking**:
```swift
// Infrastructure Layer - SwiftData Model
@Model
public final class UnifiedRewardProgressModel {
    @Attribute(.unique) public var profileId: UUID
    public var unlockedGameIds: [String]
    public var totalStarsEarned: Int
    public var lastUpdated: Date
    
    // Tracks progress across ALL apps
    public var appProgress: [String: AppProgressData] // AppType.rawValue : data
    
    public init(profileId: UUID) {
        self.profileId = profileId
        self.unlockedGameIds = []
        self.totalStarsEarned = 0
        self.lastUpdated = Date()
        self.appProgress = [:]
    }
}

// Repository Protocol
public protocol UnifiedRewardRepositoryPort {
    func getUnlockedGames(for profileId: ProfileID) async throws -> [RewardGame]
    func unlockGame(_ gameId: RewardGameID, for profileId: ProfileID) async throws
    func addStars(_ count: Int, for profileId: ProfileID) async throws
    func checkUnlockEligibility(for profileId: ProfileID) async throws -> [RewardGame]
}
```

**Therapist Configuration**:
```swift
public struct RewardConfiguration {
    public let enabledGames: [RewardGameID]        // Which games are available
    public let unlockMode: UnlockMode              // How games unlock
    public let starsPerActivity: Int               // Reward rate
    public let maxDailyGameTime: TimeInterval?     // Optional limit
    
    public enum UnlockMode {
        case automatic                            // Unlock based on requirements
        case therapistControlled                  // Therapist manually unlocks
        case progressive                          // Unlock in sequence
    }
}
```

**Usage Flow**:
```swift
// In HelpSeeker app:
func completeScenario(_ scenario: Scenario) async {
    // Award stars
    let stars = calculateStars(for: scenario.result)
    await rewardRepository.addStars(stars, for: currentProfile.id)
    
    // Check for new unlocks (checks across ALL app progress)
    let newUnlocks = await rewardRepository.checkUnlockEligibility(for: currentProfile.id)
    
    for game in newUnlocks {
        await rewardRepository.unlockGame(game.id, for: currentProfile.id)
        showUnlockCelebration(game)
    }
}

// In EmotionExplorer app (same child, same rewards):
func completeEmotionActivity() async {
    // Same star system
    let stars = calculateStars(for: activity.result)
    await rewardRepository.addStars(stars, for: currentProfile.id)
    
    // Same unlock check - games unlocked in HelpSeeker are already available
    // AND new unlocks from combined progress work here too
}
```

**Benefits of Unified System**:
1. **Seamless Experience**: Child doesn't lose rewards when switching apps
2. **Motivation Continuity**: Progress in one app motivates progress in others
3. **Therapist Flexibility**: Can use multiple apps without managing separate reward systems
4. **Simplified Management**: One place to configure all rewards
5. **Fair Access**: All platform users benefit from new games immediately

---

## Accessibility Standards

### Required Features

1. **VoiceOver Support**
   - All buttons labeled
   - Character descriptions
   - Dynamic type support

2. **Visual Accessibility**
   - High contrast mode
   - Reduced motion option
   - Colorblind-friendly palettes

3. **Interaction**
   - Adjustable tap target sizes
   - Hold duration adjustments
   - Switch control support

4. **Cognitive**
   - Clear, simple language
   - Consistent navigation
   - Optional audio instructions

---

## Development Workflow

### Git Strategy

```bash
# Feature branches
feature/help-seeker-speech-mode
feature/emotion-explorer-zones

# Release branches
release/help-seeker-v1.0
release/platform-core-v2.0

# Tags
v1.0.0-help-seeker
v1.2.0-platform-core
```

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: Platform CI
on: [push, pull_request]
jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test platform-core
        run: swift test --package-path platform-core
      - name: Test individual apps
        run: |
          cd apps/help-seeker
          xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air'
```

---

## Therapist & Parent Planning Dashboard

### Overview
A comprehensive planning interface allows therapists and parents to pre-configure all therapeutic activities before the child begins. This enables structured, goal-oriented therapy sessions and consistent practice across settings.

### Core Planning Features

#### 1. Session Planning
```swift
struct TherapySessionPlan: Identifiable, Codable {
    let id: UUID
    let title: String
    let scheduledDate: Date?
    let activities: [PlannedActivity]
    let estimatedDuration: TimeInterval
    let notes: String
    let createdBy: UserRole // .therapist or .parent
}

struct PlannedActivity: Codable {
    let activityType: ActivityType
    let specificContent: ActivityContent
    let order: Int
    let requiredCompletions: Int // Minimum times to complete
    let unlocksReward: Bool
    let hintLevel: HintLevel
}

enum ActivityType {
    case scenario(ScenarioID)
    case emotionGame(EmotionGameType)
    case dailyTask(TaskID)
    case socialStory(StoryID)
    case playActivity(PlayActivityID)
    case scheduleTask(ScheduleTaskID)
    case communicationExercise(ExerciseID)
    case rewardGame(RewardGameType)
}
```

#### 2. Content Selection Interface

**Scenario Library Browser**:
- Filter by: Category (physical, academic, social, emotional)
- Filter by: Difficulty (1-5)
- Filter by: Skills targeted
- Search by keywords
- Preview scenario content
- Add to session with drag-and-drop

**Progressive Difficulty Planning**:
- Automatically suggest next scenarios based on mastery
- Create learning paths (e.g., "Help-Seeking Basics" → "Advanced Scenarios")
- Lock harder scenarios until prerequisites completed
- Override locks for therapeutic challenge

#### 3. Reward Game Configuration

**Available Games Management**:
```swift
struct RewardGameConfiguration {
    let gameType: RewardGameType
    let isEnabled: Bool
    let unlockRequirement: UnlockRequirement
    let maxDailyPlays: Int?
    let ageRange: ClosedRange<Int>
}
```

**Game Unlocking Strategy**:
- Pre-unlock specific games for motivation
- Set completion thresholds (e.g., "Unlock after 3 scenarios")
- Configure game difficulty per child
- Limit game time vs. therapeutic time ratio

#### 4. Weekly/Monthly Planning

**Calendar View**:
- Schedule recurring sessions (e.g., "Daily Living - Morning Routine")
- Set session frequency and duration
- Track completion against plan
- Adjust based on progress data

**Goal Setting**:
- Define IEP-aligned goals
- Link activities to specific objectives
- Track goal mastery over time
- Generate progress reports

#### 5. Child Mode Lockdown

**Supervised Access**:
- Child mode shows ONLY pre-selected activities
- No access to unplanned scenarios
- No access to unrestricted reward games
- Clean, distraction-free interface

**Emergency Override**:
- Quick access to calming activities
- Immediate access to familiar favorites
- "I need a break" button with pre-approved break activities

### Dashboard Views

#### Therapist View
```
┌─────────────────────────────────────────────────────────────────┐
│  THERAPIST DASHBOARD - Child: Max (Age 8)                      │
├─────────────────────────────────────────────────────────────────┤
│  📅 This Week's Plan                                           │
│  ├─ Monday: 3 scenarios + 2 reward games                       │
│  ├─ Tuesday: DailyLiving - Dressing sequence                   │
│  ├─ Wednesday: EmotionExplorer - Yellow zone coping           │
│  └─ ...                                                        │
│                                                                 │
│  🎯 Active Goals                                               │
│  ├─ [████████░░] Asking for help (academic) - 80%             │
│  ├─ [████░░░░░░] Emotional identification - 40%               │
│  └─ [██████░░░░] Morning routine independence - 60%           │
│                                                                 │
│  📊 Recent Progress                                            │
│  ├─ 12 sessions this week                                      │
│  ├─ 85% success rate                                           │
│  └─ 3 new skills acquired                                      │
│                                                                 │
│  [Create New Session] [View Reports] [Export Data]            │
└─────────────────────────────────────────────────────────────────┘
```

#### Parent View
```
┌─────────────────────────────────────────────────────────────────┐
│  PARENT DASHBOARD - Child: Max                                 │
├─────────────────────────────────────────────────────────────────┤
│  📝 Today's Activities                                         │
│  (Set by therapist Ms. Johnson)                                │
│                                                                 │
│  ☐ Scenario: "Can't reach book" (10 min)                       │
│  ☐ DailyLiving: Brush teeth sequence (5 min)                   │
│  ☐ Reward: Letter matching game (10 min)                       │
│                                                                 │
│  [Start Session] [Modify Activities] [View Progress]          │
│                                                                 │
│  💡 Suggested Activities                                       │
│  Based on Max's progress, try these:                           │
│  • Emotion check-in before bedtime                            │
│  • Practice asking for help at dinner                         │
└─────────────────────────────────────────────────────────────────┘
```

### Data Management

#### Session Templates
- Save successful session structures as templates
- Share templates with other therapists
- Community template library
- Evidence-based session protocols

#### Progress Tracking
- Real-time completion updates
- Automatic difficulty adjustment suggestions
- Trend analysis and pattern detection
- Export to CSV/PDF for IEP meetings

#### Multi-User Collaboration
- Therapist creates plan
- Parent implements at home
- Both see same progress data
- Messaging/notes between therapist and parent

### Implementation Architecture

```swift
// Planning Use Cases
protocol SessionPlanningUseCaseProtocol {
    func createSessionPlan(_ plan: TherapySessionPlan) async throws
    func getUpcomingSessions(for childId: ProfileID) async throws -> [TherapySessionPlan]
    func markActivityComplete(_ activityId: UUID, in sessionId: UUID) async throws
    func generateProgressReport(for childId: ProfileID, dateRange: DateInterval) async throws -> ProgressReport
}

protocol ContentCurationUseCaseProtocol {
    func getRecommendedScenarios(for childId: ProfileID, limit: Int) async throws -> [Scenario]
    func filterScenarios(by criteria: FilterCriteria) async throws -> [Scenario]
    func getScenarioPath(for goal: TherapyGoal) async throws -> [ScenarioID]
}

// SwiftData Models
@Model
final class SessionPlanModel {
    @Attribute(.unique) var id: UUID
    var childProfileId: UUID
    var title: String
    var scheduledDate: Date?
    var activitiesData: Data // Encoded [PlannedActivity]
    var isCompleted: Bool
    var createdByTherapist: Bool
    var notes: String?
}
```

### Security & Privacy

- **Local Only**: All planning data stays on device
- **No Cloud Sync**: No external servers, completely private
- **Role-Based Access**: Therapist vs Parent vs Child views
- **Export Control**: Data export requires explicit permission
- **Audit Trail**: Track who created/modified plans

### Benefits

1. **Structured Therapy**: Pre-planned sessions ensure focus
2. **Consistency**: Same activities at home and therapy
3. **Goal Alignment**: Activities directly support IEP goals
4. **Progress Tracking**: Clear visibility into skill development
5. **Time Management**: Scheduled sessions fit into daily routines
6. **Reduced Anxiety**: Child knows what to expect
7. **Data-Driven**: Adjust plans based on actual progress

---

## Community & Open Source

### Contribution Areas

1. **Content**
   - Scenario submissions
   - Social story templates
   - Translation contributions

2. **Code**
   - Bug fixes
   - Feature implementations
   - Accessibility improvements

3. **Assets**
   - Character illustrations
   - Sound effects
   - Outfit designs

4. **Research**
   - Evidence updates
   - Best practice documentation

### Recognition
- Contributors list in app
- Attribution in documentation
- Community spotlight features

---

## Success Metrics

### Platform-Level
- Monthly active users (across all apps)
- Cross-app adoption rate
- User retention (30-day, 90-day)
- Community contribution rate

### App-Level
- Session completion rate
- Skill acquisition metrics
- User satisfaction scores
- Therapeutic outcome measures

### Impact
- Real-world skill generalization
- Parent/therapist reported outcomes
- Academic research partnerships

---

## Next Steps

### Immediate (Month 1)
1. Set up GitHub organization: `spectrum-skills`
2. Create platform-core repository structure
3. Design logo and brand identity
4. Register app bundle IDs

### Short-term (Months 2-3)
1. Implement core domain layer
2. Create character system
3. Begin HelpSeeker development
4. Build asset library

### Medium-term (Months 4-6)
1. Complete HelpSeeker MVP
2. Beta testing
3. Release HelpSeeker v1.0
4. Begin EmotionExplorer development

### Long-term (Months 7-12)
1. Launch 2-3 additional apps
2. Build community
3. Expand language support
4. Research partnerships

---

*This platform represents a new approach to therapeutic technology: evidence-based, child-centered, privacy-focused, and community-driven. HelpSeeker is just the beginning.*
