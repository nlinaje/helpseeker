# Development Plan - HelpSeeker

**License:** AGPLv3 (Application), CC0 (Assets)  
**Languages Priority:** DE (first), ES (second), IT/EN/FR (later)  
**Architecture:** Hexagonal + DDD + SOLID  
**Difficulty Levels:** 1-5

---

## 1. Architecture Overview

### Hexagonal Architecture Structure

```
HelpSeeker/
├── Domain/                    # Core business logic (no dependencies)
│   ├── Entities/
│   ├── ValueObjects/
│   └── Events/
├── Application/               # Use cases and ports
│   ├── Ports/                 # Interfaces (driven by core)
│   └── UseCases/              # Business operations
├── Infrastructure/            # Adapters (external dependencies)
│   ├── Persistence/
│   ├── Speech/
│   ├── Content/
│   └── Network/
└── Presentation/              # SwiftUI Views
    ├── ChildMode/
    └── TherapistMode/
```

### Domain Layer (Pure Swift, No Dependencies)

```swift
// MARK: - Entities

struct UserProfile: Identifiable, Codable {
    let id: UserProfileID
    let childName: String
    let selectedCharacter: Character
    let createdAt: Date
    let lastPlayedAt: Date?
    let preferences: UserPreferences
    let unlockedOutfits: Set<OutfitID>
    let achievements: Set<AchievementID>
}

struct UserProfileID: ValueObject {
    let value: UUID
}

struct UserPreferences: Codable {
    let preferredLanguage: Language
    let audioVolume: Double  // 0.0 - 1.0
    let showHints: Bool
    let reduceMotion: Bool
    let highContrast: Bool
}

struct Character: Identifiable, Codable {
    let id: CharacterID
    let type: CharacterType
    let name: String  // User-defined name
    let gender: Gender
    let baseAppearance: AppearanceConfig
    let currentOutfit: Outfit?
}

struct CharacterID: ValueObject {
    let value: String
}

enum CharacterType: String, Codable, CaseIterable {
    case animal = "animal"
    case robot = "robot"
    case fantasy = "fantasy"
    case abstract = "abstract"
}

enum Gender: String, Codable {
    case male = "male"
    case female = "female"
    case neutral = "neutral"
}

struct AppearanceConfig: Codable {
    let primaryColor: String  // Hex color
    let secondaryColor: String
    let accessories: [String]  // IDs of equipped accessories
}

struct Outfit: Identifiable, Codable {
    let id: OutfitID
    let name: LocalizedString
    let unlockRequirement: UnlockRequirement
    let assetPath: String  // Path to outfit assets
}

struct OutfitID: ValueObject {
    let value: String
}

enum UnlockRequirement: Codable {
    case scenariosCompleted(count: Int)
    case perfectStreak(count: Int)
    case categoryMastered(category: ScenarioCategory)
    case achievement(achievementId: String)
}

struct Achievement: Identifiable, Codable {
    let id: AchievementID
    let title: LocalizedString
    let description: LocalizedString
    let icon: String
    let unlockCondition: UnlockCondition
}

struct AchievementID: ValueObject {
    let value: String
}

enum UnlockCondition: Codable {
    case firstScenario
    case streak(days: Int)
    case perfectScore(scenarios: Int)
    case allCategories
}

struct Scenario: Identifiable, Codable {
    let id: ScenarioID
    let category: ScenarioCategory
    let difficulty: DifficultyLevel
    let metadata: ScenarioMetadata
    let content: LocalizedContent
    let interactions: InteractionConfig
    
    init(id: String, category: ScenarioCategory, difficulty: Int, 
         metadata: ScenarioMetadata, content: LocalizedContent,
         interactions: InteractionConfig) {
        self.id = ScenarioID(value: id)
        self.category = category
        self.difficulty = DifficultyLevel(rawValue: difficulty)!
        self.metadata = metadata
        self.content = content
        self.interactions = interactions
    }
}

struct ScenarioID: ValueObject {
    let value: String
}

enum ScenarioCategory: String, Codable, CaseIterable {
    case physical = "physical"      // Can't reach, something broke, hurt
    case academic = "academic"      // Don't understand, need explanation
    case social = "social"          // Lost, need bathroom, feeling sick
    case emotional = "emotional"    // Overwhelmed, frustrated, scared
}

struct DifficultyLevel: RawRepresentable, Codable {
    let rawValue: Int
    static let veryEasy = DifficultyLevel(rawValue: 1)
    static let easy = DifficultyLevel(rawValue: 2)
    static let medium = DifficultyLevel(rawValue: 3)
    static let hard = DifficultyLevel(rawValue: 4)
    static let veryHard = DifficultyLevel(rawValue: 5)
}

struct ScenarioMetadata: Codable {
    let version: String
    let author: String?
    let createdAt: Date
    let tags: [String]
    let estimatedDuration: TimeInterval  // seconds
    let requiresMicrophone: Bool
}

// MARK: - Value Objects

struct LocalizedContent: Codable {
    let situation: LocalizedString
    let correctPhrase: LocalizedString
    let acceptableVariations: [LocalizedString]  // For speech recognition flexibility
    let distractors: [LocalizedString]          // Wrong answers for choice mode
    let hints: [LocalizedString]?               // Optional progressive hints
    let feedback: LocalizedFeedback
}

struct LocalizedString: Codable {
    let de: String          // German (priority)
    let es: String          // Spanish (second priority)
    let it: String?         // Italian (future)
    let en: String?         // English (future)
    let fr: String?         // French (future)
    
    func text(for language: Language) -> String {
        switch language {
        case .german: return de
        case .spanish: return es
        case .italian: return it ?? en ?? de
        case .english: return en ?? de
        case .french: return fr ?? en ?? de
        }
    }
    
    /// Replaces template placeholders with actual values
    /// Example: "{{character_name}} needs help" -> "Lio needs help"
    func rendered(for language: Language, with context: TemplateContext) -> String {
        var text = self.text(for: language)
        text = text.replacingOccurrences(of: "{{character_name}}", with: context.characterName)
        return text
    }
}

struct TemplateContext {
    let characterName: String
}

struct LocalizedFeedback: Codable {
    let success: LocalizedString
    let encouragement: LocalizedString
    let correction: LocalizedString
}

struct InteractionConfig: Codable {
    let mode: InteractionMode
    let timeLimit: TimeInterval?           // Optional time pressure
    let maxAttempts: Int                   // Before showing answer
    let showHints: Bool                    // Progressive hint system
    let requireSpeech: Bool                // If true, must use microphone
    let celebrationDuration: TimeInterval  // 3-5 seconds recommended
}

enum InteractionMode: String, Codable {
    case choiceOnly = "choice_only"         // Tap correct phrase
    case speechOnly = "speech_only"         // Must say it out loud
    case choiceThenSpeech = "choice_then_speech"  // Both
    case adaptive = "adaptive"              // Starts with choice, progresses to speech
}

enum Language: String, CaseIterable {
    case german = "de"
    case spanish = "es"
    case italian = "it"
    case english = "en"
    case french = "fr"
}

// MARK: - Progress Entities

struct ScenarioAttempt: Identifiable, Codable {
    let id: UUID
    let userProfileId: UserProfileID
    let scenarioId: ScenarioID
    let timestamp: Date
    let mode: PlayMode
    let result: AttemptResult
    let duration: TimeInterval
    let usedSpeech: Bool
    let recognizedText: String?
    let confidenceScore: Double?
}

struct UserProgress: Codable {
    let userProfileId: UserProfileID
    let totalAttempts: Int
    let successfulAttempts: Int
    let currentStreak: Int
    let longestStreak: Int
    let completedScenarios: Set<ScenarioID>
    let accuracyByCategory: [ScenarioCategory: Double]
    let averageTimePerScenario: TimeInterval
    let lastPlayedAt: Date?
}

enum PlayMode: String, Codable {
    case choice = "choice"
    case speech = "speech"
}

enum AttemptResult: String, Codable {
    case successFirstTry = "success_first"
    case successAfterRetry = "success_retry"
    case failed = "failed"
    case abandoned = "abandoned"
}

// UserProgress already defined above with userProfileId

// MARK: - Speech Recognition

struct RecognitionResult: Codable {
    let text: String
    let confidence: Double           // 0.0 - 1.0
    let matchedPhrase: String?       // Which target phrase was matched
    let isCorrect: Bool
    let alternatives: [String]       // Other possible transcriptions
}

enum SpeechError: Error {
    case permissionDenied
    case notAvailable
    case recognitionFailed
    case timeout
    case noMatch
}
```

### Application Layer - Ports (Interfaces)

```swift
// MARK: - Repository Ports

protocol ScenarioRepositoryPort {
    func fetchAll(language: Language) async throws -> [Scenario]
    func fetchById(_ id: ScenarioID) async throws -> Scenario?
    func fetchByCategory(_ category: ScenarioCategory, language: Language) async throws -> [Scenario]
    func fetchByDifficulty(_ difficulty: DifficultyLevel, language: Language) async throws -> [Scenario]
    func save(_ scenario: Scenario) async throws
}

protocol ProgressRepositoryPort {
    func saveAttempt(_ attempt: ScenarioAttempt) async throws
    func fetchAttempts(for userId: UserProfileID, scenarioId: ScenarioID?) async throws -> [ScenarioAttempt]
    func fetchProgress(for userId: UserProfileID) async throws -> UserProgress
    func fetchRecentAttempts(for userId: UserProfileID, limit: Int) async throws -> [ScenarioAttempt]
}

protocol UserProfileRepositoryPort {
    func createProfile(_ profile: UserProfile) async throws
    func fetchProfile(id: UserProfileID) async throws -> UserProfile?
    func fetchAllProfiles() async throws -> [UserProfile]
    func updateProfile(_ profile: UserProfile) async throws
    func deleteProfile(id: UserProfileID) async throws
    func setActiveProfile(id: UserProfileID) async throws
    func getActiveProfile() async throws -> UserProfile?
}

protocol CharacterRepositoryPort {
    func fetchAvailableCharacters() async throws -> [CharacterTemplate]
    func fetchAvailableOutfits(for characterType: CharacterType) async throws -> [Outfit]
    func checkUnlockRequirements(_ requirements: UnlockRequirement, for userId: UserProfileID) async -> Bool
    func unlockOutfit(_ outfitId: OutfitID, for userId: UserProfileID) async throws
}

struct CharacterTemplate: Codable {
    let type: CharacterType
    let name: LocalizedString
    let description: LocalizedString
    let previewAsset: String
    let availableOutfits: [OutfitID]
}

// MARK: - Service Ports

protocol SpeechRecognitionPort {
    var isAvailable: Bool { get }
    func requestPermission() async -> Bool
    func startListening() async throws
    func stopListening() async
    func recognize(targetPhrases: [String], timeout: TimeInterval) async -> Result<RecognitionResult, SpeechError>
}

protocol AudioPlaybackPort {
    func playFeedback(_ type: FeedbackType) async
    func speak(_ text: String, language: Language) async
    func stop() async
}

enum FeedbackType {
    case success
    case encouragement
    case error
    case tapSound
}

protocol AnalyticsPort {
    func trackEvent(_ event: AnalyticsEvent)
    func exportData() async throws -> Data  // CSV/JSON
}

enum AnalyticsEvent {
    case scenarioStarted(id: String)
    case scenarioCompleted(id: String, result: AttemptResult, duration: TimeInterval)
    case speechRecognized(confidence: Double, matched: Bool)
    case hintShown(scenarioId: String, hintIndex: Int)
}

// MARK: - Content Loading

protocol ScenarioLoaderPort {
    func loadScenarios(from source: ContentSource) async throws -> [Scenario]
    func validateScenario(_ scenario: Scenario) -> [ValidationError]
}

enum ContentSource {
    case bundle
    case documents
    case url(URL)
}

struct ValidationError {
    let field: String
    let message: String
}
```

### Application Layer - Use Cases (SOLID Compliant)

```swift
// MARK: - Play Scenario Use Case

protocol PlayScenarioUseCaseProtocol {
    func execute(scenarioId: ScenarioID, mode: PlayMode) async throws -> ScenarioSession
}

struct PlayScenarioUseCase: PlayScenarioUseCaseProtocol {
    private let scenarioRepository: ScenarioRepositoryPort
    private let progressRepository: ProgressRepositoryPort
    private let speechRecognizer: SpeechRecognitionPort
    
    init(scenarioRepository: ScenarioRepositoryPort,
         progressRepository: ProgressRepositoryPort,
         speechRecognizer: SpeechRecognitionPort) {
        self.scenarioRepository = scenarioRepository
        self.progressRepository = progressRepository
        self.speechRecognizer = speechRecognizer
    }
    
    func execute(scenarioId: ScenarioID, mode: PlayMode) async throws -> ScenarioSession {
        guard let scenario = try await scenarioRepository.fetchById(scenarioId) else {
            throw UseCaseError.scenarioNotFound
        }
        
        let startTime = Date()
        
        return ScenarioSession(
            scenario: scenario,
            mode: mode,
            startTime: startTime,
            attemptCount: 0
        )
    }
}

enum UseCaseError: Error {
    case scenarioNotFound
    case speechNotAvailable
    case invalidMode
    case profileNotFound
    case outfitNotUnlockable
    case outfitAlreadyUnlocked
}

// MARK: - Recognize Speech Use Case

protocol RecognizeSpeechUseCaseProtocol {
    func execute(targetPhrases: [String], timeout: TimeInterval) async -> RecognitionResult
}

struct RecognizeSpeechUseCase: RecognizeSpeechUseCaseProtocol {
    private let speechRecognizer: SpeechRecognitionPort
    
    init(speechRecognizer: SpeechRecognitionPort) {
        self.speechRecognizer = speechRecognizer
    }
    
    func execute(targetPhrases: [String], timeout: TimeInterval) async -> RecognitionResult {
        guard speechRecognizer.isAvailable else {
            return RecognitionResult(
                text: "",
                confidence: 0,
                matchedPhrase: nil,
                isCorrect: false,
                alternatives: []
            )
        }
        
        do {
            let result = try await speechRecognizer.recognize(
                targetPhrases: targetPhrases,
                timeout: timeout
            )
            
            switch result {
            case .success(let recognitionResult):
                return recognitionResult
            case .failure:
                return RecognitionResult(
                    text: "",
                    confidence: 0,
                    matchedPhrase: nil,
                    isCorrect: false,
                    alternatives: []
                )
            }
        } catch {
            return RecognitionResult(
                text: "",
                confidence: 0,
                matchedPhrase: nil,
                isCorrect: false,
                alternatives: []
            )
        }
    }
}

// MARK: - Track Progress Use Case

protocol TrackProgressUseCaseProtocol {
    func recordAttempt(_ attempt: ScenarioAttempt, for userId: UserProfileID) async throws
    func getProgress(for userId: UserProfileID) async throws -> UserProgress
    func getRecommendations(for userId: UserProfileID) async throws -> [ScenarioID]
    func checkAchievements(for userId: UserProfileID) async throws -> [Achievement]
}

struct TrackProgressUseCase: TrackProgressUseCaseProtocol {
    private let progressRepository: ProgressRepositoryPort
    
    init(progressRepository: ProgressRepositoryPort) {
        self.progressRepository = progressRepository
    }
    
    func recordAttempt(_ attempt: ScenarioAttempt, for userId: UserProfileID) async throws {
        try await progressRepository.saveAttempt(attempt)
    }
    
    func getProgress(for userId: UserProfileID) async throws -> UserProgress {
        return try await progressRepository.fetchProgress(for: userId)
    }
    
    func getRecommendations(for userId: UserProfileID) async throws -> [ScenarioID] {
        let progress = try await progressRepository.fetchProgress(for: userId)
        let attempts = try await progressRepository.fetchAttempts(for: userId, scenarioId: nil)
        
        // Simple recommendation: scenarios not yet completed
        // Future: ML-based difficulty adjustment
        return []
    }
    
    func checkAchievements(for userId: UserProfileID) async throws -> [Achievement] {
        // Check and return newly unlocked achievements
        return []
    }
}

// MARK: - User Profile Use Cases

protocol CreateUserProfileUseCaseProtocol {
    func execute(childName: String, characterType: CharacterType, characterName: String, gender: Gender) async throws -> UserProfile
}

struct CreateUserProfileUseCase: CreateUserProfileUseCaseProtocol {
    private let userRepository: UserProfileRepositoryPort
    
    init(userRepository: UserProfileRepositoryPort) {
        self.userRepository = userRepository
    }
    
    func execute(childName: String, characterType: CharacterType, characterName: String, gender: Gender) async throws -> UserProfile {
        let character = Character(
            id: CharacterID(value: UUID().uuidString),
            type: characterType,
            name: characterName,
            gender: gender,
            baseAppearance: AppearanceConfig(
                primaryColor: "#4CAF50",
                secondaryColor: "#FFC107",
                accessories: []
            ),
            currentOutfit: nil
        )
        
        let profile = UserProfile(
            id: UserProfileID(value: UUID()),
            childName: childName,
            selectedCharacter: character,
            createdAt: Date(),
            lastPlayedAt: nil,
            preferences: UserPreferences(
                preferredLanguage: .german,
                audioVolume: 0.8,
                showHints: true,
                reduceMotion: false,
                highContrast: false
            ),
            unlockedOutfits: [],
            achievements: []
        )
        
        try await userRepository.createProfile(profile)
        return profile
    }
}

protocol SwitchUserProfileUseCaseProtocol {
    func execute(to profileId: UserProfileID) async throws
    func listAvailableProfiles() async throws -> [UserProfile]
}

struct SwitchUserProfileUseCase: SwitchUserProfileUseCaseProtocol {
    private let userRepository: UserProfileRepositoryPort
    
    init(userRepository: UserProfileRepositoryPort) {
        self.userRepository = userRepository
    }
    
    func execute(to profileId: UserProfileID) async throws {
        try await userRepository.setActiveProfile(id: profileId)
    }
    
    func listAvailableProfiles() async throws -> [UserProfile] {
        return try await userRepository.fetchAllProfiles()
    }
}

// MARK: - Character Customization Use Cases

protocol CustomizeCharacterUseCaseProtocol {
    func changeCharacterName(userId: UserProfileID, newName: String) async throws
    func changeAppearance(userId: UserProfileID, appearance: AppearanceConfig) async throws
    func equipOutfit(userId: UserProfileID, outfitId: OutfitID) async throws
}

struct CustomizeCharacterUseCase: CustomizeCharacterUseCaseProtocol {
    private let userRepository: UserProfileRepositoryPort
    
    init(userRepository: UserProfileRepositoryPort) {
        self.userRepository = userRepository
    }
    
    func changeCharacterName(userId: UserProfileID, newName: String) async throws {
        guard var profile = try await userRepository.fetchProfile(id: userId) else {
            throw UseCaseError.profileNotFound
        }
        
        var character = profile.selectedCharacter
        // Character is struct, so we need to create new instance
        let updatedCharacter = Character(
            id: character.id,
            type: character.type,
            name: newName,
            gender: character.gender,
            baseAppearance: character.baseAppearance,
            currentOutfit: character.currentOutfit
        )
        
        profile = UserProfile(
            id: profile.id,
            childName: profile.childName,
            selectedCharacter: updatedCharacter,
            createdAt: profile.createdAt,
            lastPlayedAt: profile.lastPlayedAt,
            preferences: profile.preferences,
            unlockedOutfits: profile.unlockedOutfits,
            achievements: profile.achievements
        )
        
        try await userRepository.updateProfile(profile)
    }
    
    func changeAppearance(userId: UserProfileID, appearance: AppearanceConfig) async throws {
        // Similar implementation
    }
    
    func equipOutfit(userId: UserProfileID, outfitId: OutfitID) async throws {
        // Similar implementation
    }
}

protocol CheckUnlockablesUseCaseProtocol {
    func checkAvailableOutfits(for userId: UserProfileID) async throws -> [Outfit]
    func unlockOutfit(userId: UserProfileID, outfitId: OutfitID) async throws
}

struct CheckUnlockablesUseCase: CheckUnlockablesUseCaseProtocol {
    private let characterRepository: CharacterRepositoryPort
    private let userRepository: UserProfileRepositoryPort
    
    init(characterRepository: CharacterRepositoryPort, userRepository: UserProfileRepositoryPort) {
        self.characterRepository = characterRepository
        self.userRepository = userRepository
    }
    
    func checkAvailableOutfits(for userId: UserProfileID) async throws -> [Outfit] {
        guard let profile = try await userRepository.fetchProfile(id: userId) else {
            throw UseCaseError.profileNotFound
        }
        
        let allOutfits = try await characterRepository.fetchAvailableOutfits(for: profile.selectedCharacter.type)
        
        // Filter out already unlocked
        return allOutfits.filter { !profile.unlockedOutfits.contains($0.id) }
    }
    
    func unlockOutfit(userId: UserProfileID, outfitId: OutfitID) async throws {
        try await characterRepository.unlockOutfit(outfitId, for: userId)
    }
}

// MARK: - Session State

struct ScenarioSession {
    let userProfile: UserProfile
    let scenario: Scenario
    let mode: PlayMode
    let startTime: Date
    var attemptCount: Int
    var usedHints: [Int] = []
    var recognizedText: String?
    
    var templateContext: TemplateContext {
        TemplateContext(characterName: userProfile.selectedCharacter.name)
    }
}

// MARK: - Asset Management

protocol AssetManagerPort {
    func downloadAllAssets() async throws -> Progress
    func isAssetDownloaded(_ assetId: String) -> Bool
    func getAssetPath(_ assetId: String) -> URL?
    func clearAssetCache() async throws
    func getStorageUsage() -> UInt64
}

enum AssetType: String {
    case character = "characters"
    case outfit = "outfits"
    case scenario = "scenarios"
    case audio = "audio"
}
```

### Infrastructure Layer - Adapters

```swift
// MARK: - SwiftData Repository Adapter

import SwiftData

@Model
final class ScenarioAttemptModel {
    @Attribute(.unique) var id: UUID
    var scenarioId: String
    var timestamp: Date
    var modeRaw: String
    var resultRaw: String
    var duration: Double
    var usedSpeech: Bool
    var recognizedText: String?
    var confidenceScore: Double?
    
    init(from attempt: ScenarioAttempt) {
        self.id = attempt.id
        self.scenarioId = attempt.scenarioId.value
        self.timestamp = attempt.timestamp
        self.modeRaw = attempt.mode.rawValue
        self.resultRaw = attempt.result.rawValue
        self.duration = attempt.duration
        self.usedSpeech = attempt.usedSpeech
        self.recognizedText = attempt.recognizedText
        self.confidenceScore = attempt.confidenceScore
    }
    
    func toDomain() -> ScenarioAttempt {
        ScenarioAttempt(
            id: id,
            scenarioId: ScenarioID(value: scenarioId),
            timestamp: timestamp,
            mode: PlayMode(rawValue: modeRaw)!,
            result: AttemptResult(rawValue: resultRaw)!,
            duration: duration,
            usedSpeech: usedSpeech,
            recognizedText: recognizedText,
            confidenceScore: confidenceScore
        )
    }
}

final class SwiftDataProgressRepository: ProgressRepositoryPort {
    private let modelContainer: ModelContainer
    private let modelContext: ModelContext
    
    init(modelContainer: ModelContainer) {
        self.modelContainer = modelContainer
        self.modelContext = ModelContext(modelContainer)
    }
    
    func saveAttempt(_ attempt: ScenarioAttempt) async throws {
        let model = ScenarioAttemptModel(from: attempt)
        modelContext.insert(model)
        try modelContext.save()
    }
    
    func fetchAttempts(for scenarioId: ScenarioID?) async throws -> [ScenarioAttempt] {
        let descriptor = FetchDescriptor<ScenarioAttemptModel>()
        let models = try modelContext.fetch(descriptor)
        
        if let id = scenarioId {
            return models
                .filter { $0.scenarioId == id.value }
                .map { $0.toDomain() }
        }
        
        return models.map { $0.toDomain() }
    }
    
    func fetchProgress() async throws -> UserProgress {
        let attempts = try await fetchAttempts(for: nil)
        
        // Calculate progress metrics
        let successful = attempts.filter { 
            $0.result == .successFirstTry || $0.result == .successAfterRetry 
        }.count
        
        return UserProgress(
            totalAttempts: attempts.count,
            successfulAttempts: successful,
            currentStreak: calculateStreak(from: attempts),
            longestStreak: 0, // Calculate from history
            completedScenarios: Set(),
            accuracyByCategory: [:],
            averageTimePerScenario: 0
        )
    }
    
    private func calculateStreak(from attempts: [ScenarioAttempt]) -> Int {
        // Implementation
        return 0
    }
}

// MARK: - JSON Scenario Repository

final class JSONScenarioRepository: ScenarioRepositoryPort {
    private let loader: JSONScenarioLoader
    private var cache: [Language: [Scenario]] = [:]
    
    init(loader: JSONScenarioLoader) {
        self.loader = loader
    }
    
    func fetchAll(language: Language) async throws -> [Scenario] {
        if let cached = cache[language] {
            return cached
        }
        
        let scenarios = try await loader.loadScenarios(from: .bundle)
        cache[language] = scenarios
        return scenarios
    }
    
    func fetchById(_ id: ScenarioID) async throws -> Scenario? {
        let all = try await fetchAll(language: .german)
        return all.first { $0.id.value == id.value }
    }
    
    func fetchByCategory(_ category: ScenarioCategory, language: Language) async throws -> [Scenario] {
        let all = try await fetchAll(language: language)
        return all.filter { $0.category == category }
    }
    
    func fetchByDifficulty(_ difficulty: DifficultyLevel, language: Language) async throws -> [Scenario] {
        let all = try await fetchAll(language: language)
        return all.filter { $0.difficulty.rawValue == difficulty.rawValue }
    }
    
    func save(_ scenario: Scenario) async throws {
        // Read-only for bundled scenarios
        throw RepositoryError.readOnly
    }
}

enum RepositoryError: Error {
    case readOnly
    case notFound
}

// MARK: - iOS Native Speech Adapter

import Speech
import AVFoundation

final class IOSSpeechRecognizer: SpeechRecognitionPort {
    private let speechRecognizer: SFSpeechRecognizer?
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    
    var isAvailable: Bool {
        return SFSpeechRecognizer.authorizationStatus() == .authorized &&
               speechRecognizer?.isAvailable == true
    }
    
    init(locale: Locale = .current) {
        self.speechRecognizer = SFSpeechRecognizer(locale: locale)
    }
    
    func requestPermission() async -> Bool {
        // Request microphone permission
        let audioSession = AVAudioSession.sharedInstance()
        let micStatus = await withCheckedContinuation { continuation in
            audioSession.requestRecordPermission { granted in
                continuation.resume(returning: granted)
            }
        }
        
        guard micStatus else { return false }
        
        // Request speech recognition permission
        let speechStatus = await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { status in
                continuation.resume(returning: status == .authorized)
            }
        }
        
        return speechStatus
    }
    
    func startListening() async throws {
        // Implementation
    }
    
    func stopListening() async {
        // Implementation
    }
    
    func recognize(targetPhrases: [String], timeout: TimeInterval) async -> Result<RecognitionResult, SpeechError> {
        // Implementation with fuzzy matching against target phrases
        return .failure(.recognitionFailed)
    }
}
```

---

## 2. Scenario Structure & File Format

### JSON Schema for Scenarios

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "category", "difficulty", "metadata", "content", "interactions"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^scenario_[0-9]{3}$",
      "description": "Unique identifier: scenario_001 to scenario_999"
    },
    "category": {
      "type": "string",
      "enum": ["physical", "academic", "social", "emotional"]
    },
    "difficulty": {
      "type": "integer",
      "minimum": 1,
      "maximum": 5,
      "description": "1=Very Easy, 5=Very Hard"
    },
    "metadata": {
      "type": "object",
      "required": ["version", "createdAt", "estimatedDuration", "requiresMicrophone"],
      "properties": {
        "version": {
          "type": "string",
          "pattern": "^[0-9]+\\.[0-9]+$"
        },
        "author": {
          "type": ["string", "null"]
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        },
        "estimatedDuration": {
          "type": "number",
          "description": "Estimated time in seconds"
        },
        "requiresMicrophone": {
          "type": "boolean"
        }
      }
    },
    "content": {
      "type": "object",
      "required": ["situation", "correctPhrase", "acceptableVariations", "distractors", "feedback"],
      "properties": {
        "situation": {
          "type": "object",
          "required": ["de", "es"],
          "properties": {
            "de": { "type": "string" },
            "es": { "type": "string" },
            "it": { "type": "string" },
            "en": { "type": "string" },
            "fr": { "type": "string" }
          },
          "additionalProperties": false
        },
        "correctPhrase": {
          "type": "object",
          "required": ["de", "es"],
          "properties": {
            "de": { "type": "string" },
            "es": { "type": "string" },
            "it": { "type": "string" },
            "en": { "type": "string" },
            "fr": { "type": "string" }
          }
        },
        "acceptableVariations": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["de", "es"],
            "properties": {
              "de": { "type": "string" },
              "es": { "type": "string" },
              "it": { "type": "string" },
              "en": { "type": "string" },
              "fr": { "type": "string" }
            }
          },
          "minItems": 1,
          "maxItems": 10
        },
        "distractors": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["de", "es"],
            "properties": {
              "de": { "type": "string" },
              "es": { "type": "string" },
              "it": { "type": "string" },
              "en": { "type": "string" },
              "fr": { "type": "string" }
            }
          },
          "minItems": 2,
          "maxItems": 4
        },
        "hints": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["de", "es"],
            "properties": {
              "de": { "type": "string" },
              "es": { "type": "string" }
            }
          }
        },
        "feedback": {
          "type": "object",
          "required": ["success", "encouragement", "correction"],
          "properties": {
            "success": {
              "type": "object",
              "required": ["de", "es"],
              "properties": {
                "de": { "type": "string" },
                "es": { "type": "string" }
              }
            },
            "encouragement": {
              "type": "object",
              "required": ["de", "es"],
              "properties": {
                "de": { "type": "string" },
                "es": { "type": "string" }
              }
            },
            "correction": {
              "type": "object",
              "required": ["de", "es"],
              "properties": {
                "de": { "type": "string" },
                "es": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "interactions": {
      "type": "object",
      "required": ["mode", "maxAttempts", "showHints", "requireSpeech", "celebrationDuration"],
      "properties": {
        "mode": {
          "type": "string",
          "enum": ["choice_only", "speech_only", "choice_then_speech", "adaptive"]
        },
        "timeLimit": {
          "type": ["number", "null"],
          "description": "Time limit in seconds, null for no limit"
        },
        "maxAttempts": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5
        },
        "showHints": {
          "type": "boolean"
        },
        "requireSpeech": {
          "type": "boolean"
        },
        "celebrationDuration": {
          "type": "number",
          "minimum": 1,
          "maximum": 10,
          "description": "Seconds to show celebration"
        }
      }
    }
  }
}
```

### Example Scenario: "Can't Reach the Book"

**File:** `scenario_001.json`

```json
{
  "id": "scenario_001",
  "category": "physical",
  "difficulty": 1,
  "metadata": {
    "version": "1.0",
    "author": "AI-Generated",
    "createdAt": "2026-01-21T10:00:00Z",
    "tags": ["reach", "book", "help", "physical"],
    "estimatedDuration": 30,
    "requiresMicrophone": false
  },
  "content": {
    "situation": {
      "de": "{{character_name}} sieht ein Buch auf einem hohen Regal. Er kann es nicht erreichen und braucht Hilfe.",
      "es": "{{character_name}} ve un libro en un estante alto. No puede alcanzarlo y necesita ayuda.",
      "it": "{{character_name}} vede un libro su uno scaffale alto. Non riesce a prenderlo e ha bisogno di aiuto.",
      "en": "{{character_name}} sees a book on a high shelf. He cannot reach it and needs help.",
      "fr": "{{character_name}} voit un livre sur une étagère haute. Il ne peut pas l'atteindre et a besoin d'aide."
    },
    "correctPhrase": {
      "de": "Kannst du {{character_name}} bitte helfen, das Buch zu erreichen?",
      "es": "¿Puedes ayudar a {{character_name}} a alcanzar el libro, por favor?",
      "it": "Puoi aiutare {{character_name}} a prendere il libro, per favore?",
      "en": "Can you help {{character_name}} reach the book, please?",
      "fr": "Peux-tu aider {{character_name}} à atteindre le livre, s'il te plaît?"
    },
    "acceptableVariations": [
      {
        "de": "Ich brauche Hilfe beim Erreichen des Buches",
        "es": "Necesito ayuda para alcanzar el libro",
        "it": "Ho bisogno di aiuto per prendere il libro",
        "en": "I need help reaching the book",
        "fr": "J'ai besoin d'aide pour atteindre le livre"
      },
      {
        "de": "Kannst du mir das Buch geben?",
        "es": "¿Me puedes dar el libro?",
        "it": "Puoi darmi il libro?",
        "en": "Can you give me the book?",
        "fr": "Peux-tu me donner le livre?"
      },
      {
        "de": "Das Buch ist zu hoch für mich",
        "es": "El libro está muy alto para mí",
        "it": "Il libro è troppo in alto per me",
        "en": "The book is too high for me",
        "fr": "Le livre est trop haut pour moi"
      }
    ],
    "distractors": [
      {
        "de": "Gib mir das Buch!",
        "es": "¡Dame el libro!",
        "it": "Dammi il libro!",
        "en": "Give me the book!",
        "fr": "Donne-moi le livre!"
      },
      {
        "de": "Ich kann das nicht.",
        "es": "No puedo hacerlo.",
        "it": "Non posso farlo.",
        "en": "I can't do it.",
        "fr": "Je ne peux pas le faire."
      },
      {
        "de": "*schweigt und starrt auf das Buch*",
        "es": "*se queda en silencio mirando el libro*",
        "it": "*rimane in silenzio guardando il libro*",
        "en": "*stays silent staring at the book*",
        "fr": "*reste silencieux en regardant le livre*"
      }
    ],
    "hints": [
      {
        "de": "Denke daran: Höflich um Hilfe bitten.",
        "es": "Recuerda: Pide ayuda de manera educada."
      },
      {
        "de": "Versuche: 'Kannst du mir helfen...'",
        "es": "Intenta: '¿Puedes ayudarme...'"
      }
    ],
    "feedback": {
      "success": {
        "de": "Super! Du hast höflich um Hilfe gebeten. Das ist genau richtig!",
        "es": "¡Excelente! Pediste ayuda de manera educada. ¡Eso es exactamente correcto!"
      },
      "encouragement": {
        "de": "Guter Versuch! Versuche es noch einmal mit einer höflichen Bitte.",
        "es": "¡Buen intento! Intenta de nuevo con una petición amable."
      },
      "correction": {
        "de": "Das war nicht ganz richtig. Wenn wir Hilfe brauchen, sollten wir höflich fragen: 'Kannst du mir bitte helfen?'",
        "es": "Eso no estuvo del todo bien. Cuando necesitamos ayuda, debemos pedirla amablemente: '¿Puedes ayudarme, por favor?'"
      }
    }
  },
  "interactions": {
    "mode": "adaptive",
    "timeLimit": null,
    "maxAttempts": 3,
    "showHints": true,
    "requireSpeech": false,
    "celebrationDuration": 4
  }
}
```

### File Organization

```
HelpSeeker/
├── Resources/
│   ├── Scenarios/
│   │   ├── schema.json              # JSON Schema for validation
│   │   ├── categories.json          # Category definitions
│   │   └── scenarios/
│   │       ├── physical/
│   │       │   ├── scenario_001.json
│   │       │   ├── scenario_002.json
│   │       │   └── ...
│   │       ├── academic/
│   │       ├── social/
│   │       └── emotional/
│   └── Characters/
│       ├── animal/
│       │   ├── neutral.svg
│       │   ├── confused.svg
│       │   ├── happy.svg
│       │   ├── celebrating.svg
│       │   └── outfits/
│       ├── robot/
│       ├── fantasy/
│       └── abstract/
```

### Supporting Files

**categories.json:**
```json
{
  "categories": [
    {
      "id": "physical",
      "name": {
        "de": "Körperlich",
        "es": "Físico",
        "it": "Fisico",
        "en": "Physical",
        "fr": "Physique"
      },
      "description": {
        "de": "Situationen mit körperlichen Herausforderungen",
        "es": "Situaciones con desafíos físicos"
      },
      "icon": "figure.walk",
      "color": "#4CAF50"
    }
  ]
}
```

---

## 3. AI Generation Prompts

### Prompt 1: Generate Core 20 Scenarios

```
Generate 20 help-seeking scenarios for children with autism (ages 6-12).

DISTRIBUTION:
- Physical: 5 scenarios (can't reach, something broke, hurt, too heavy, stuck)
- Academic: 5 scenarios (don't understand, need explanation, can't solve, confused, wrong materials)
- Social: 5 scenarios (lost, need bathroom, feeling sick, can't find friend, need to leave)
- Emotional: 5 scenarios (overwhelmed, frustrated, scared, anxious, angry)

DIFFICULTY DISTRIBUTION:
- Level 1 (Very Easy): 5 scenarios
- Level 2 (Easy): 5 scenarios  
- Level 3 (Medium): 5 scenarios
- Level 4 (Hard): 3 scenarios
- Level 5 (Very Hard): 2 scenarios

OUTPUT FORMAT (JSON):
For each scenario, provide:
1. ID: scenario_001 to scenario_020
2. Category: physical/academic/social/emotional
3. Difficulty: 1-5
4. Situation description (use {{character_name}} placeholder, concrete, specific)
5. Correct phrase (use {{character_name}} placeholder, polite, clear)
6. 3-5 acceptable variations (different ways to say it, use {{character_name}})
7. 3 distractors (wrong answers: too vague, wrong tone, silence)
8. 2 progressive hints

IMPORTANT: Use {{character_name}} placeholder instead of specific names like "Max" so the scenario works with any character the child chooses.

EXAMPLE SITUATIONS:
Physical: "Can't reach book on shelf", "Jar lid too tight", "Shoe untied and can't bend", "Door stuck", "Dropped toy under furniture"
Academic: "Don't understand math problem", "Can't read a word", "Instructions unclear", "Wrong worksheet", "Pen not working"
Social: "Can't find classroom", "Need bathroom urgently", "Feeling sick", "Lost in store", "Want to go home"
Emotional: "Frustrated with puzzle", "Scared of loud noise", "Overwhelmed by crowd", "Angry at unfair rule", "Anxious about change"

GENERATE IN GERMAN AND SPANISH:
- Primary language: German (DE)
- Secondary language: Spanish (ES)
- Mark Italian (IT), English (EN), French (FR) as null for now

MAKE IT REALISTIC:
- Use children's names (Max, Emma, Leo, Sophie)
- Concrete situations, not abstract
- Age-appropriate language (6-12 years)
- Culturally appropriate for DE and ES
```

### Prompt 2: Validate and Improve

```
Review these 20 scenarios for:

1. CLARITY: Is the situation immediately understandable?
2. DIFFICULTY: Does the level match the complexity?
3. PHRASES: Are correct phrases polite and natural?
4. VARIATIONS: Are acceptable variations truly acceptable?
5. DISTRACTORS: Are wrong answers clearly wrong but plausible?
6. BALANCE: Good mix of situations across categories?

FOR EACH SCENARIO, CHECK:
- [ ] Situation is concrete (not abstract)
- [ ] Correct phrase is polite and clear
- [ ] Variations maintain politeness
- [ ] Distractors represent common errors
- [ ] Hints are helpful but don't give away answer
- [ ] Appropriate for autism (clear, predictable, not overwhelming)

PROVIDE:
- List of any scenarios needing revision
- Specific improvements for weak scenarios
- Confirmation when all are good
```

### Prompt 3: Generate Character Assets

```
Generate character illustrations for a children's app (ages 6-12).

CHARACTER TYPES (create one of each):
1. ANIMAL: Cute, friendly animal (suggest: fox, bear, or rabbit)
2. ROBOT: Friendly, rounded robot with expressive face
3. FANTASY: Friendly fantasy creature (suggest: small dragon or friendly monster)
4. ABSTRACT: Simple geometric shape with personality (circle/round character)

EXPRESSIONS NEEDED (for each character):
- neutral: Standard/default expression
- confused: Needs help, uncertain
- happy: Success, celebration
- celebrating: Joyful, excited

STYLE REQUIREMENTS:
- Illustrated cartoon style
- Simple, clean lines
- Child-friendly colors
- Gender-neutral (or easily customizable)
- Works at small sizes (app icons) and large (full screen)
- Consistent style across all expressions
- Background: transparent/white

TECHNICAL SPECS:
- Format: SVG (vector) preferred, or high-res PNG
- Size: 512x512px minimum for expressions
- Color palette: 3-4 main colors per character
- Accessibility: High contrast option

OUTFIT VARIATIONS (10 per character):
- Hat variations (5): cap, crown, wizard hat, helmet, headband
- Accessory variations (5): glasses, bow tie, scarf, belt, backpack

GENERATE:
- 4 base characters (1 per type)
- 4 expressions per character (16 total)
- 10 outfit items per character (40 total)
- Style guide document

IMPORTANT:
- All assets must be CC0 (public domain)
- Consistent art style across all characters
- Child-safe, non-threatening designs
- Culturally neutral
```

---

## 4. 10-Week MVP Development Timeline

### Week 1: Foundation & Architecture (Updated)

**Goals:**
- [ ] Create Xcode project with folder structure
- [ ] Set up hexagonal architecture
- [ ] Define all domain entities and value objects
  - UserProfile, Character, Outfit, Achievement entities
  - TemplateContext for scenario placeholders
- [ ] Create port interfaces
  - UserProfileRepositoryPort
  - CharacterRepositoryPort
  - AssetManagerPort
- [ ] Configure SwiftData schema
  - UserProfileModel, ScenarioAttemptModel

**Deliverables:**
- Project compiles
- Domain layer implemented with unit tests
- Port interfaces defined (including user/character management)
- SwiftData models created (multi-user support)

**Time Estimate:** 12-18 hours

### Week 2: Infrastructure Adapters (Updated)

**Goals:**
- [ ] Implement JSON scenario loader with template processing
- [ ] Implement SwiftData repositories
  - Progress repository (per-user)
  - User profile repository
- [ ] Create iOS speech recognition adapter
- [ ] Build audio playback adapter
- [ ] Create character repository with unlock logic
- [ ] Add error handling

**Deliverables:**
- Can load scenarios from JSON with {{character_name}} templates
- Can persist progress per user to SwiftData
- User profile CRUD operations working
- Character/outfit management working
- Speech recognition working (basic)
- All adapters unit tested

**Time Estimate:** 12-16 hours

### Week 3: Application Use Cases (Updated)

**Goals:**
- [ ] Implement PlayScenarioUseCase (with user profile)
- [ ] Implement RecognizeSpeechUseCase
- [ ] Implement TrackProgressUseCase (per-user tracking)
- [ ] Implement user management use cases
  - CreateUserProfileUseCase
  - SwitchUserProfileUseCase
- [ ] Implement character customization use cases
  - CustomizeCharacterUseCase
  - CheckUnlockablesUseCase
- [ ] Add input validation
- [ ] Write comprehensive unit tests

**Deliverables:**
- All use cases implemented (including user/character management)
- Unit tests with mocked ports
- Error handling in place
- Integration tests passing

**Time Estimate:** 12-15 hours

### Week 4: User Profile & Onboarding UI

**Goals:**
- [ ] Create profile selection view (launch screen)
- [ ] Build user onboarding flow
  - Enter child name
  - Select character type (animal/robot/fantasy/abstract)
  - Select gender
  - Name the character
  - Download assets
- [ ] Create character selection/creator view
- [ ] Implement profile switcher (in-app)

**Deliverables:**
- Profile selection at app launch
- Onboarding flow complete
- Can create multiple user profiles
- Character customization UI

**Time Estimate:** 12-16 hours

### Week 5: Scenario Gameplay UI (Part 1)

**Goals:**
- [ ] Create scenario list view (filtered by user progress)
- [ ] Build scenario detail view with character display
- [ ] Implement choice mode UI with character expressions
- [ ] Integrate template rendering ({{character_name}})
- [ ] Add basic animations and character reactions

**Deliverables:**
- Child can browse scenarios
- Character visible in scenarios
- Choice mode fully functional
- Character expressions change based on situation
- Basic accessibility support

**Time Estimate:** 12-16 hours

### Week 6: Speech Mode & Celebrations

**Goals:**
- [ ] Implement speech mode UI with waveform
- [ ] Create recording interface
- [ ] Implement fuzzy matching for speech recognition
- [ ] Add celebration animations with character
- [ ] Create reward/outfit unlock notifications
- [ ] Add retry mechanism

**Deliverables:**
- Speech mode functional
- Character celebrates with child
- Visual feedback during recording
- Outfit unlock notifications
- Multiple attempts supported

**Time Estimate:** 12-15 hours

### Week 7: Content & Localization

**Goals:**
- [ ] Generate 20 scenarios with AI (using {{character_name}} placeholders)
- [ ] Translate to German and Spanish
- [ ] Generate character assets (AI illustrations)
  - 4 character types × 4 expressions
  - 10 outfits per character type
- [ ] Create outfit unlock requirements
- [ ] Validate JSON against schema
- [ ] Organize scenario and asset files
- [ ] Test all 20 scenarios with different characters

**Deliverables:**
- 20 validated scenarios in DE and ES
- Character illustrations (SVG/PNG)
- Outfit assets
- Properly organized file structure
- Content validation script

**Time Estimate:** 10-12 hours

### Week 8: Asset Management & Offline Support

**Goals:**
- [ ] Implement asset download manager
- [ ] Create asset caching system
- [ ] Build download progress UI
- [ ] Implement offline mode detection
- [ ] Add storage management (clear cache, view usage)
- [ ] Test offline functionality

**Deliverables:**
- All assets downloadable on first run
- App works offline after download
- Storage usage visible
- Clear cache functionality

**Time Estimate:** 10-12 hours

### Week 9: Progress Tracking & Character Shop

**Goals:**
- [ ] Build progress dashboard (per user)
- [ ] Create character customization shop
  - View available outfits
  - Unlock outfits based on achievements
  - Equip outfits
- [ ] Create statistics views
- [ ] Add session history
- [ ] Implement export functionality (per user)

**Deliverables:**
- Progress tracking working per user
- Character shop functional
- Outfit unlock system working
- Statistics displayed
- Data export to CSV/JSON

**Time Estimate:** 12-14 hours

### Week 10: Polish, Testing & Documentation

**Goals:**
- [ ] UI/UX polish
- [ ] Accessibility audit (VoiceOver, Reduce Motion)
- [ ] Performance optimization
- [ ] Multi-user testing
- [ ] Write user documentation
- [ ] Create open source repository structure
- [ ] Add AGPLv3 and CC0 licenses

**Deliverables:**
- App store ready (except for review)
- Documentation complete
- Open source repository prepared
- Tested with multiple user profiles
- CC0 assets licensed

**Time Estimate:** 10-14 hours

### Total Time: ~100-120 hours (10-12 hours/week)

---

## 5. Testing Strategy

### Unit Tests (Domain & Application)

```swift
// Domain Tests
class ScenarioTests: XCTestCase {
    func testScenarioInitialization() { }
    func testDifficultyLevels() { }
    func testLocalizedContent() { }
}

class ProgressTests: XCTestCase {
    func testAttemptCreation() { }
    func testProgressCalculation() { }
    func testStreakCalculation() { }
}

// Use Case Tests (with mocked ports)
class PlayScenarioUseCaseTests: XCTestCase {
    var mockScenarioRepo: MockScenarioRepository!
    var mockProgressRepo: MockProgressRepository!
    var mockSpeechRecognizer: MockSpeechRecognizer!
    var useCase: PlayScenarioUseCase!
    
    override func setUp() {
        mockScenarioRepo = MockScenarioRepository()
        mockProgressRepo = MockProgressRepository()
        mockSpeechRecognizer = MockSpeechRecognizer()
        useCase = PlayScenarioUseCase(
            scenarioRepository: mockScenarioRepo,
            progressRepository: mockProgressRepo,
            speechRecognizer: mockSpeechRecognizer
        )
    }
    
    func testExecute_WithValidScenario_ReturnsSession() async { }
    func testExecute_WithInvalidScenario_ThrowsError() async { }
}

class RecognizeSpeechUseCaseTests: XCTestCase {
    func testRecognize_WithMatchingPhrase_ReturnsCorrect() { }
    func testRecognize_WithNoMatch_ReturnsIncorrect() { }
    func testRecognize_WhenUnavailable_ReturnsEmpty() { }
}
```

### Integration Tests (Infrastructure)

```swift
class JSONScenarioLoaderTests: XCTestCase {
    func testLoadScenarios_FromBundle_ReturnsValidScenarios() { }
    func testLoadScenarios_InvalidJSON_ThrowsError() { }
    func testValidateScenario_MissingRequiredField_ReturnsErrors() { }
}

class SwiftDataRepositoryTests: XCTestCase {
    func testSaveAndFetchAttempt_PersistsCorrectly() { }
    func testFetchProgress_CalculatesMetricsCorrectly() { }
}

class IOSSpeechRecognizerTests: XCTestCase {
    func testRequestPermission_Granted_ReturnsTrue() { }
    func testRecognize_WithTargetPhrases_ReturnsResult() { }
}
```

### UI Tests (End-to-End)

```swift
class ChildModeFlowTests: XCTestCase {
    func testCompleteScenario_ChoiceMode() {
        // Launch app
        // Select scenario
        // Choose correct answer
        // Verify celebration
        // Verify progress saved
    }
    
    func testCompleteScenario_SpeechMode() {
        // Launch app
        // Select scenario
        // Tap record
        // Simulate speech
        // Verify recognition
        // Verify feedback
    }
    
    func testScenarioRetry_AfterWrongAnswer() {
        // Select scenario
        // Choose wrong answer
        // Verify correction shown
        // Choose correct answer
        // Verify success
    }
}
```

### Test Commands

```bash
# Run all tests
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air'

# Run only unit tests
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air' -only-testing HelpSeekerTests

# Run specific test class
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air' -only-testing HelpSeekerTests/PlayScenarioUseCaseTests

# Run with coverage
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air' -enableCodeCoverage YES
```

---

## 6. Web-Based Scenario Creator

### Features (MVP)

1. **JSON Editor**
   - Form-based scenario creation
   - Real-time validation against schema
   - Preview mode

2. **Translation Helper**
   - Input German text
   - AI-suggest Spanish translation
   - Manual editing

3. **Testing Tools**
   - Test speech recognition on phrases
   - Validate distractor quality
   - Preview scenario flow

4. **Export**
   - Download as JSON file
   - Validate before export
   - Generate batch files

### Tech Stack

- **Framework:** React or Vue.js (lightweight)
- **Validation:** JSON Schema validation (ajv)
- **Storage:** LocalStorage or GitHub Gist API
- **Hosting:** GitHub Pages (free, fits open source)

### File Structure

```
scenario-creator/
├── index.html
├── src/
│   ├── components/
│   │   ├── ScenarioForm.jsx
│   │   ├── TranslationPanel.jsx
│   │   ├── PreviewMode.jsx
│   │   └── Validator.jsx
│   ├── utils/
│   │   ├── schema.js
│   │   └── validator.js
│   └── App.jsx
├── public/
│   └── schema.json
└── package.json
```

### Separate Repository

Create as `HelpSeeker-ScenarioCreator` repository:
- Independent development
- Can be updated without app releases
- Community can contribute scenarios
- Documentation for scenario authors

---

## 7. Open Source Setup

### Repository Structure

```
HelpSeeker/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── scenario_suggestion.md
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   └── CONTRIBUTING.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── SCENARIOS.md
│   └── TRANSLATION.md
├── HelpSeeker/          # Main iOS app
│   ├── Domain/
│   ├── Application/
│   ├── Infrastructure/
│   ├── Presentation/
│   └── Resources/
├── Shared/              # Shared with Scenario Creator
│   ├── Domain/
│   └── Schema/
├── Resources/
│   └── Scenarios/
├── Tests/
│   ├── UnitTests/
│   └── UITests/
├── LICENSE (AGPLv3)
├── LICENSE-ASSETS (CC0)
├── README.md
└── CHANGELOG.md
```

### License Strategy

**AGPLv3 for Code:**
```
HelpSeeker - iOS App for Teaching Help-Seeking
Copyright (C) 2026 [Your Name]

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

**CC0 for Assets:**
```
All scenario content, images, audio, and other assets in this repository
are released under CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.

You can copy, modify, distribute and perform the work, even for commercial
purposes, all without asking permission.
```

### Contributing Guidelines

1. **Code Contributions**
   - Follow hexagonal architecture
   - Add unit tests for new use cases
   - Maintain SOLID principles
   - Update documentation

2. **Scenario Contributions**
   - Use web-based scenario creator
   - Validate against schema
   - Include all 5 languages (or mark as TODO)
   - Test in app before submitting

3. **Translation Contributions**
   - Maintain meaning across languages
   - Keep cultural appropriateness
   - Test with native speakers when possible

---

## 8. Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Hexagonal + DDD + SOLID | Testability, OCP for speech engines |
| **Difficulty Levels** | 5 levels (1-5) | Granular progression |
| **Languages Priority** | DE → ES → IT/EN/FR | User's location + Spanish market |
| **Speech Engine MVP** | iOS Native | Faster to implement, works offline |
| **Speech Engine Phase 2** | Whisper (CoreML) | Better accuracy for children |
| **Scenario Creator** | Web-based (React) | Accessible, easy updates |
| **License Code** | AGPLv3 | Copyleft, protects open source |
| **License Assets** | CC0 | Maximum sharing, no attribution burden |
| **Platform** | iOS 17+ | SwiftData, modern APIs |
| **iPad Support** | iPad 6th gen+ | iOS 17.7.10 confirmed working |
| **Character System** | 4 types (animal, robot, fantasy, abstract) | User choice, personalization |
| **User Profiles** | Multiple per device | Shared iPad support |
| **Outfit Unlocking** | Achievement-based, free | Motivation without monetization |
| **Scenario Templates** | {{character_name}} placeholders | Reusable with any character |
| **Asset Format** | SVG preferred, PNG fallback | Quality vs performance |
| **Offline Support** | Full after initial download | No internet required for use |

---

## 9. Next Steps

### Immediate (This Week)

1. **Set up GitHub repository**
   - AGPLv3 license
   - CC0 license for assets
   - Issue templates
   - Project board

2. **Create Xcode project**
   - Hexagonal folder structure
   - SwiftData setup (multi-user schema)
   - Unit test target

3. **Define domain models**
   - UserProfile, Character, Outfit entities
   - Scenario entity with template support
   - Progress tracking (per-user)
   - Recognition results

### Week 1-3: Foundation

- Implement hexagonal architecture
- Build infrastructure adapters (including user management)
- Create first unit tests
- Set up asset management structure

### Week 4-6: Core Features

- User profile management (create, switch)
- Character selection and customization
- Use cases implementation
- Basic UI (Child mode with character)
- Choice mode functional

### Content Generation

- Run AI prompts to generate 20 scenarios (with {{character_name}} placeholders)
- Generate character assets (4 types, 4 expressions each, 10 outfits each)
- Translate to German and Spanish
- Validate with native speakers

---

## 10. Resources & References

### Technical
- [SwiftData Documentation](https://developer.apple.com/documentation/swiftdata)
- [SFSpeechRecognizer](https://developer.apple.com/documentation/speech/sfspeechrecognizer)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [DDD in Swift](https://medium.com/@sawo/ddd-in-swift-5a3f9f8f6b5c)

### Behavioral
- [Applied Behavior Analysis (ABA) Principles](https://www.autismspeaks.org/applied-behavior-analysis-aba)
- [Prompt Fading Techniques](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4114981/)
- [Social Skills Training for Autism](https://www.autism.org.uk/advice-and-guidance/professional-practice/social-skills)

### Speech Recognition
- [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
- [CoreML Conversion](https://apple.github.io/coremltools/)
- [iOS Speech Framework](https://developer.apple.com/documentation/speech)

### Open Source
- [AGPLv3 Full Text](https://www.gnu.org/licenses/agpl-3.0.html)
- [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- [Open Source Guide](https://opensource.guide/)

---

**Document Version:** 1.1  
**Last Updated:** 2026-02-09  
**Next Review:** After Week 5  

### Changelog
**v1.1 (2026-02-09):**
- Added multi-user profile support
- Added character system (4 types: animal, robot, fantasy, abstract)
- Added outfit/achievement unlocking system
- Added scenario template system ({{character_name}} placeholders)
- Added asset management for offline support
- Extended timeline from 8 to 10 weeks
- Added AI generation prompt for character assets
- Updated architecture to support per-user progress tracking
