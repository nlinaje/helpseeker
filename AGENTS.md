# AGENTS.md - HelpSeeker iOS App

**License:** AGPLv3 (Application), CC0 (Assets)  
**Cost:** 100% FREE - No payments, no ads, no subscriptions  
**Languages Priority:** DE (first), ES (second), IT/EN/FR (later)  
**Architecture:** Hexagonal + DDD + SOLID  
**Minimum iOS:** 17+, iPad-only

---

## Build/Run Commands

```bash
# Build project (from project root)
xcodebuild -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air'

# Run on simulator
xcrun simctl launch booted com.helpseeker.app

# Archive for distribution
xcodebuild -scheme HelpSeeker -configuration Release archive -archivePath build/HelpSeeker.xcarchive
```

## Test Commands

```bash
# Run all tests
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air'

# Run single test class
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air' -only-testing HelpSeekerTests/PlayScenarioUseCaseTests

# Run single test method
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air' -only-testing HelpSeekerTests/ProgressRepositoryTests/testSaveAttempt
```

## Lint/Format Commands

```bash
# Run SwiftLint (install: brew install swiftlint)
swiftlint lint

# Auto-fix SwiftLint issues
swiftlint --fix

# Run SwiftFormat (install: brew install swiftformat)
swiftformat --lint .

# Apply SwiftFormat fixes
swiftformat .
```

## Code Style Guidelines

### Imports
- Group: Foundation → SwiftUI → Other Apple frameworks → Third-party
- Alphabetical within groups
- No wildcard imports

```swift
import Foundation
import SwiftUI
import AVFoundation
import SwiftData
```

### Naming Conventions
- **Types**: PascalCase (`ScenarioView`, `UserProfile`)
- **Functions/Variables**: camelCase (`handleScenarioTap()`, `currentDifficulty`)
- **Constants**: camelCase (`maxRecordingDuration`)
- **Protocols**: Suffix with `able`, `ible`, or `Port` (Hexagonal Architecture)
- **Use Cases**: Suffix with `UseCase` (`PlayScenarioUseCase`)
- **Value Objects**: Descriptive nouns (`UserProfileID`, `ScenarioID`)
- **SwiftData Models**: Suffix with `Model` (`ScenarioAttemptModel`)

### Formatting
- 4 spaces indentation (Xcode default)
- Max line length: 120 characters
- Trailing closure syntax for single closures
- Explicit `self.` only when required
- Opening braces on same line

### Types & Architecture (Hexagonal + DDD)
- **Domain Layer**: Pure Swift structs, no dependencies
  - Entities: `UserProfile`, `Scenario`, `Character`
  - Value Objects: `UserProfileID`, `LocalizedString`, `DifficultyLevel`
  - Use structs by default
- **Application Layer**: Use cases and ports
  - Ports: Protocols/interfaces (suffix with `Port`)
  - Use Cases: Business operations (suffix with `UseCase`)
- **Infrastructure Layer**: Adapters for external dependencies
  - SwiftData models are `class` with `@Model` macro
  - Services: Dependency-injected, not singletons
- **Presentation Layer**: SwiftUI Views
  - Use `@State`, `@Binding`, `@ObservedObject` appropriately
  - Business logic belongs in Use Cases, not Views

### Domain Entities Example
```swift
// Value Object
struct ScenarioID: ValueObject {
    let value: String
}

// Entity (struct, immutable where possible)
struct Scenario: Identifiable, Codable {
    let id: ScenarioID
    let category: ScenarioCategory
    let difficulty: DifficultyLevel
    let content: LocalizedContent
}

// Localized content with template support
struct LocalizedString: Codable {
    let de: String  // German (priority)
    let es: String  // Spanish (second)
    let it: String? // Italian (future)
    let en: String? // English (future)
    let fr: String? // French (future)
}
```

### Ports (Interfaces)
```swift
protocol ScenarioRepositoryPort {
    func fetchAll(language: Language) async throws -> [Scenario]
    func fetchById(_ id: ScenarioID) async throws -> Scenario?
}

protocol SpeechRecognitionPort {
    var isAvailable: Bool { get }
    func recognize(targetPhrases: [String], timeout: TimeInterval) async -> Result<RecognitionResult, SpeechError>
}
```

### Use Cases
```swift
protocol PlayScenarioUseCaseProtocol {
    func execute(scenarioId: ScenarioID, mode: PlayMode) async throws -> ScenarioSession
}

struct PlayScenarioUseCase: PlayScenarioUseCaseProtocol {
    private let scenarioRepository: ScenarioRepositoryPort
    private let progressRepository: ProgressRepositoryPort
    
    init(scenarioRepository: ScenarioRepositoryPort,
         progressRepository: ProgressRepositoryPort) {
        self.scenarioRepository = scenarioRepository
        self.progressRepository = progressRepository
    }
    
    func execute(scenarioId: ScenarioID, mode: PlayMode) async throws -> ScenarioSession {
        // Implementation
    }
}
```

### SwiftData Models (Infrastructure Layer)
```swift
@Model
final class ScenarioAttemptModel {
    @Attribute(.unique) var id: UUID
    var scenarioId: String
    var timestamp: Date
    var resultRaw: String
    
    init(from attempt: ScenarioAttempt) {
        self.id = attempt.id
        self.scenarioId = attempt.scenarioId.value
        self.timestamp = attempt.timestamp
        self.resultRaw = attempt.result.rawValue
    }
}
```

### Error Handling
```swift
enum UseCaseError: Error {
    case scenarioNotFound
    case speechNotAvailable
    case profileNotFound
}

// Usage
do {
    let session = try await playScenarioUseCase.execute(scenarioId: id, mode: .choice)
} catch UseCaseError.scenarioNotFound {
    showError("Scenario not found")
} catch {
    logError("Unexpected error: \(error)")
}
```

### Template Rendering
```swift
// Scenarios use {{character_name}} placeholder
let text = localizedString.rendered(
    for: .german, 
    with: TemplateContext(characterName: "Lio")
)
// "Kannst du Lio bitte helfen?"
```

### Accessibility
- All buttons must have `.accessibilityLabel()`
- Use `.accessibilityHint()` for context
- Support Dynamic Type with `.scaledMetric`
- Respect `.accessibilityReduceMotion`

```swift
Button(action: handleHelp) {
    Text("Need Help?")
}
.accessibilityLabel("Request help button")
.accessibilityHint("Double tap to practice asking for help")
```

## Project Structure (Hexagonal Architecture)

```
HelpSeeker/
├── Domain/                    # Core business logic (no dependencies)
│   ├── Entities/
│   │   ├── UserProfile.swift
│   │   ├── Character.swift
│   │   ├── Scenario.swift
│   │   └── Progress.swift
│   ├── ValueObjects/
│   │   ├── UserProfileID.swift
│   │   ├── ScenarioID.swift
│   │   ├── LocalizedString.swift
│   │   └── DifficultyLevel.swift
│   └── Events/
│       └── DomainEvents.swift
├── Application/               # Use cases and ports
│   ├── Ports/
│   │   ├── ScenarioRepositoryPort.swift
│   │   ├── ProgressRepositoryPort.swift
│   │   ├── UserProfileRepositoryPort.swift
│   │   ├── SpeechRecognitionPort.swift
│   │   ├── AudioPlaybackPort.swift
│   │   └── DataTransferPort.swift
│   └── UseCases/
│       ├── PlayScenarioUseCase.swift
│       ├── TrackProgressUseCase.swift
│       ├── CreateUserProfileUseCase.swift
│       └── CustomizeCharacterUseCase.swift
├── Infrastructure/            # Adapters (external dependencies)
│   ├── Persistence/
│   │   ├── SwiftData/
│   │   │   ├── ScenarioAttemptModel.swift
│   │   │   ├── UserProfileModel.swift
│   │   │   └── SwiftDataProgressRepository.swift
│   │   └── JSON/
│   │       └── JSONScenarioRepository.swift
│   ├── Transfer/
│   │   ├── SpectrumArchiveManager.swift
│   │   ├── DataExporter.swift
│   │   └── DataImporter.swift
│   ├── Speech/
│   │   └── IOSSpeechRecognizer.swift
│   ├── Content/
│   │   ├── JSONScenarioLoader.swift
│   │   └── AssetManager.swift
│   └── Network/
│       └── (Future: Cloud sync)
└── Presentation/              # SwiftUI Views
    ├── ChildMode/
    │   ├── ProfileSelectionView.swift
    │   ├── OnboardingView.swift
    │   ├── ScenarioListView.swift
    │   ├── ScenarioDetailView.swift
    │   ├── CharacterCelebrationView.swift
    │   └── RewardGames/
    │       ├── RewardGameMenuView.swift
    │       ├── LetterGames/
    │       │   ├── LetterRecognitionView.swift
    │       │   └── WordBuildingView.swift
    │       ├── NumberGames/
    │       │   ├── CountingView.swift
    │       │   └── PatternCompletionView.swift
    │       ├── SoundGames/
    │       │   └── SoundMatchingView.swift
    │       ├── SpatialGames/
    │       │   └── PrepositionGameView.swift
    │       └── LogicGames/
    │           ├── PatternGameView.swift
    │           └── SortingGameView.swift
    └── TherapistMode/
        ├── ProgressDashboardView.swift
        ├── UserManagementView.swift
        └── SettingsView.swift
```

## Content Structure

### Scenarios (JSON Format)

```
Resources/
├── Scenarios/
│   ├── schema.json              # JSON Schema for validation
│   ├── categories.json          # Category definitions
│   └── scenarios/
│       ├── physical/            # Can't reach, something broke, hurt
│       ├── academic/            # Don't understand, need explanation
│       ├── social/              # Lost, need bathroom, feeling sick
│       └── emotional/           # Overwhelmed, frustrated, scared
└── Characters/
    ├── animal/
    ├── robot/
    ├── fantasy/
    └── abstract/
```

### Scenario Categories
- **Physical**: Can't reach, something broke, hurt, too heavy, stuck
- **Academic**: Don't understand, need explanation, confused
- **Social**: Lost, need bathroom, feeling sick, can't find friend
- **Emotional**: Overwhelmed, frustrated, scared, anxious, angry

### Difficulty Levels (1-5)
- Level 1 (Very Easy): 5 scenarios
- Level 2 (Easy): 5 scenarios
- Level 3 (Medium): 5 scenarios
- Level 4 (Hard): 3 scenarios
- Level 5 (Very Hard): 2 scenarios

### Educational Reward Games
Children unlock educational mini-games by completing help-seeking scenarios. Games are categorized by skill area:

- **LetterGames/**: Letter recognition, tracing, word building
- **NumberGames/**: Counting, basic math, number patterns
- **SoundGames/**: Instrument/animal sound matching
- **SpatialGames/**: Prepositions (in front of, behind, below), directional concepts
- **LogicGames/**: Pattern completion, sorting, categorization

Games adapt difficulty based on child's age (6-12) and provide dual value as both rewards and learning opportunities.

## Testing

### Unit Tests (Domain & Application)
```swift
// Domain Tests
class ScenarioTests: XCTestCase {
    func testLocalizedContentRendering() { }
    func testDifficultyLevelValidation() { }
}

// Use Case Tests (with mocked ports)
class PlayScenarioUseCaseTests: XCTestCase {
    func testExecuteWithValidScenario() { }
    func testExecuteWithInvalidScenarioThrows() { }
}
```

### Infrastructure Tests
```swift
class JSONScenarioRepositoryTests: XCTestCase {
    func testFetchAllLoadsFromBundle() { }
    func testTemplateRendering() { }
}
```

### UI Tests
```swift
class ChildModeUITests: XCTestCase {
    func testCompleteScenarioFlow() { }
    func testProfileSwitching() { }
}
```

### Test Guidelines
- Use `@MainActor` for async tests
- Mock all ports in use case tests
- Test template rendering with different contexts
- Mock AVFoundation/Speech for testing
- Test localization in German and Spanish

## Key Decisions

### Architecture
- **Hexagonal Architecture**: Domain at center, ports define interfaces, adapters implement
- **DDD**: Entities, Value Objects, Aggregates with clear boundaries
- **SOLID**: Single responsibility per use case, dependency injection

### Data
- **SwiftData**: For user profiles, progress, attempts
- **JSON Files**: For scenarios (bundled, read-only)
- **Local Only**: Privacy-first, no cloud required
- **Multi-User**: Support for multiple child profiles

### Content
- **Template System**: `{{character_name}}` placeholder in scenarios
- **Character System**: 4 types (animal, robot, fantasy, abstract)
- **Reward System**: Educational mini-games unlocked through scenario completion
- **Unified Reward Library**: All platform apps share the same reward games library
- **Cross-App Progress**: Games unlocked in one app are available in all apps
- **Outfit Unlockables**: Additional character customization rewards
- **Localization**: German priority, Spanish second, others later

### Therapeutic Planning
- **Therapist/Parent Dashboard**: Pre-configure activities and scenarios
- **Session Planning**: Select specific content, configure reward games
- **Child Mode Lockdown**: Child sees only pre-selected activities
- **Progress Tracking**: Real-time updates, goal alignment, data export
- **Multi-User Collaboration**: Shared plans between therapist and parent

### Technical
- **iPad-only**: Optimized for tablet experience
- **iOS 17+**: Use latest SwiftData and SwiftUI features
- **No External Dependencies**: Keep it simple initially
- **AGPLv3**: Open source, share alike
- **CC0 Assets**: Public domain illustrations
- **Completely Free**: No payments, no ads, no subscriptions

### Data Portability (Export/Import)
- **Export Formats**: 
  - `.spectrum` archive (ZIP containing JSON + assets) for full iPad-to-iPad transfer
  - JSON files for progress/attempts export (human-readable, web-compatible)
  - CSV for progress reports (for therapist/parent review)
- **Export Scope Options**:
  - **Full Export**: All profiles, attempts, settings, unlocked content (for device replacement)
  - **Profile Export**: Single child profile with their progress (for sharing with therapist)
  - **Progress Only**: Attempts and achievements (for backup)
  - **Settings Only**: App configuration without user data
- **Import Capability**:
  - Import from `.spectrum` files (device transfer, restore from backup)
  - Import from other SpectrumSkills apps (cross-app progress sync)
  - Validation on import to prevent data corruption
- **Web Compatibility**:
  - JSON schema designed for future web platform consumption
  - Standard data structures (ISO 8601 dates, UUIDs, locale codes)
  - No proprietary formats
- **Security & Privacy**:
  - Optional password protection for exports containing sensitive data
  - AES-256 encryption when password is provided
  - Clear indication of what data is being exported
  - User confirmation before import overwrites existing data
- **Storage**: Exports saved to Files app (iCloud Drive, local, or external storage)
- **Share Sheet Integration**: Share via AirDrop, Messages, Email, or save to cloud storage
- **Therapist Workflow**: Export child progress as CSV/JSON for IEP meetings or progress reports

## Development Timeline (MVP - 10 Weeks)

1. **Week 1**: Foundation & Architecture (Domain layer, ports)
2. **Week 2**: Infrastructure Adapters (SwiftData, speech, JSON)
3. **Week 3**: Application Use Cases (PlayScenario, TrackProgress)
4. **Week 4**: User Profile & Onboarding UI
5. **Week 5**: Scenario Gameplay UI (Choice mode)
6. **Week 6**: Speech Mode & Celebrations
7. **Week 7**: Content & Localization (20 scenarios, assets)
8. **Week 8**: Therapist/Parent Dashboard (session planning, content curation)
9. **Week 9**: Progress Tracking & Educational Reward Games (initial set)
10. **Week 10**: Polish, Testing & Documentation

Total: ~100-120 hours (10-12 hours/week)

### Post-MVP: Reward Games Expansion
- **Phase 1**: Core educational games (letters, numbers, colors, sounds)
- **Phase 2**: Spatial and logic games (prepositions, patterns, sorting)
- **Phase 3**: Advanced games (math, complex puzzles, memory)
- **Phase 4**: Community-contributed educational content
