# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This is a **planning-phase** project. The repository currently contains design documents and a PWA prototype (`pwa-test/`). No Swift/Xcode project exists yet. Key planning documents:

- `AGENTS.md` — architecture decisions, code style, planned project structure
- `README.md` — product overview (HelpSeeker app for children with autism)
- `EXECUTIVE_SUMMARY.md` — platform roadmap (SpectrumSkills multi-app platform)
- `development_plan.md` — detailed development plan
- `pwa-test/` — standalone PWA prototype for testing Whisper speech recognition

## Platform Overview

**SpectrumSkills** is an open-source therapeutic platform for children with autism (ages 6–12). **HelpSeeker** is the first app—an iPad-only iOS 17+ app in Swift/SwiftUI teaching help-seeking skills through interactive scenarios with a customizable companion character.

Platform GitHub org structure (planned):
```
spectrum-skills/
├── platform-core/    # Shared Swift package (Domain, Infrastructure, Shared UI)
├── apps/
│   ├── help-seeker/  # App 1 (IN DEV)
│   └── ...           # Future apps (emotion-explorer, daily-living, etc.)
├── assets/           # CC0 character assets
└── content/          # Scenarios, translations
```

## Build & Test Commands (for when the Xcode project exists)

```bash
# Build
xcodebuild -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air'

# Run all tests
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air'

# Run a single test class
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air' \
  -only-testing HelpSeekerTests/PlayScenarioUseCaseTests

# Run a single test method
xcodebuild test -scheme HelpSeeker -destination 'platform=iOS Simulator,name=iPad Air' \
  -only-testing HelpSeekerTests/ProgressRepositoryTests/testSaveAttempt

# Lint / format (requires: brew install swiftlint swiftformat)
swiftlint lint
swiftlint --fix
swiftformat --lint .
swiftformat .
```

## PWA Test (pwa-test/)

Standalone HTML/JS PWA for testing Whisper AI speech recognition on iOS Safari.

```bash
# Serve over HTTP (for local testing)
python3 -m http.server 8080

# Serve over HTTPS (required for microphone on non-localhost)
cd pwa-test && python3 https_server.py   # runs on port 8443 with cert.pem/key.pem
```

## Architecture: Hexagonal + DDD + SOLID

The planned iOS app uses strict Hexagonal Architecture with four layers:

| Layer | Purpose | Rules |
|-------|---------|-------|
| **Domain** | Core business logic | Pure Swift structs, zero external dependencies |
| **Application** | Use cases & ports (interfaces) | Depends only on Domain |
| **Infrastructure** | Adapters (SwiftData, Speech, JSON) | Implements Application ports |
| **Presentation** | SwiftUI views | Calls Use Cases, no direct infrastructure access |

**Key naming conventions:**
- Ports (interfaces): suffix `Port` — `ScenarioRepositoryPort`
- Use Cases: suffix `UseCase` — `PlayScenarioUseCase`
- SwiftData models: suffix `Model`, use `class @Model` — `ScenarioAttemptModel`
- Domain entities/value objects: plain descriptive nouns, `struct` by default

**Dependency injection only** — no singletons in Application or Domain layers.

## Key Technical Decisions

- **iPad-only**, iOS 17+; uses SwiftData and latest SwiftUI APIs
- **No external Swift dependencies** (no SPM packages beyond Apple frameworks)
- **Local data only** — no cloud, no network (privacy-first)
- **SwiftData** for user profiles, progress, attempts
- **JSON files** (bundled, read-only) for scenarios
- **Localization priority**: German first, Spanish second, Italian/English/French later
- **Template system**: `{{character_name}}` placeholders in scenario text
- **Unified reward games library**: shared across all SpectrumSkills apps; progress/unlocks transfer between apps
- **Data export formats**: `.spectrum` archive (ZIP+JSON), JSON, CSV; optional AES-256 encryption

## Code Style

- 4-space indentation, max line length 120 characters
- Import order: Foundation → SwiftUI → other Apple frameworks → third-party (alphabetical within groups)
- Explicit `self.` only when required
- All interactive elements require `.accessibilityLabel()` and `.accessibilityHint()`
- Respect `.accessibilityReduceMotion` for animations
- Use `@MainActor` for async test methods; mock all ports in use case tests

## Scenario Content

Scenarios are bundled JSON files with `{{character_name}}` templates. Four categories: Physical, Academic, Social, Emotional. Five difficulty levels (1–5, 20 scenarios total for MVP). Characters come in four types: animal, robot, fantasy, abstract.

## Licensing

- Code: AGPLv3
- Assets: CC0 (public domain)
- 100% free — no payments, ads, or subscriptions
