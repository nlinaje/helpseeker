# HelpSeeker - iPad AAC App for Teaching Independent Help-Seeking

## Overview

**Target Users**: Children with autism spectrum disorders who need help but don't independently ask for it - they only respond "yes" when prompted by adults.

**Goal**: Teach children to independently ask for help when they need it, using behavioral intervention principles (ABA - Applied Behavior Analysis).

**Platform**: iPad only (iOS 17+)
**Tech Stack**: Swift, SwiftUI, SwiftData, AVFoundation
**License**: MIT License (Open Source)

---

## Behavioral Intervention Strategy

### Phase-Based Approach to Teaching Independent Help-Seeking

| Phase | Prompt Level | Behavior Target | Child Experience |
|-------|-------------|-----------------|------------------|
| **Phase 1** | Full prompt + help | Child taps button when adult prompts "Do you need help?" | Immediate help after button tap, strong reward |
| **Phase 2** | Partial prompt | Child taps button when adult points to iPad or says "What do you need?" | Gradual independence, reduced prompting |
| **Phase 3** | Minimal prompt | Child taps button when adult is in room (no verbal prompt) | Emerging independence |
| **Phase 4** | No prompt (goal) | Child independently taps button when they need help | Target behavior achieved |

### Behavioral Principles Applied

1. **Prompt Fading**: Gradually reduce adult prompts as child demonstrates independence
2. **Shaping**: Reinforce successive approximations of target behavior
3. **Positive Reinforcement**: Immediate rewards for desired behavior
4. **Generalization**: App behavior should transfer to real-world help-seeking

---

## Key Features

### 1. Progressive Prompt Fading System

**Child Experience by Phase:**

- **Phase 1**: Large pulsing "Need help?" text + audio prompt ("Do you need help? Tap here!")
- **Phase 2**: Smaller prompt + occasional reminder
- **Phase 3**: Minimal visual hint (subtle glow around button)
- **Phase 4**: No prompts, child must act independently

**Caregiver Controls:**
- Set current prompt level phase
- View progress toward next phase
- Manual or automatic phase advancement options

### 2. Immediate Positive Reinforcement

**When child taps help button:**
- Instant celebration animation (confetti, stars, particles)
- Character companion cheers and celebrates
- Audio praise: "Great job asking for help!" (AVSpeechSynthesizer)
- Reward points (+10 stars/tokens)
- Streak counter increment
- Voice recording starts (for caregiver review)

### 3. Gamification Elements

- **Character Companion**: Animated friend on screen that celebrates with child
- **Level Progression**: Unlock new characters/themes as child demonstrates independence
- **Achievement Badges**: "First time asking alone", "3-day streak", "Week warrior", "Independence champion"
- **Progress Bar**: Visual representation of journey toward independence
- **Collectible Rewards**: Stickers, accessories, costumes for character

### 4. Data & Analytics for Caregivers

- **Prompt Level Tracking**: Which prompts the child responds to
- **Latency Measurement**: Time between prompt availability and child action
- **Independence Percentage**: How often child acts without full prompt
- **Trend Graphs**: Visual progress over time (daily, weekly, monthly)
- **Voice Recordings**: Library of recordings for communication development assessment
- **Export Data**: CSV format for therapy sessions and progress documentation

---

## App Architecture

### Two Modes of Operation

#### Child Mode (Primary Interface)
- Large, simple help button (central, prominent)
- Character companion visible on screen
- Reward display (current points, streak, achievements)
- Minimal distractions
- Guided Access compatible (single-app mode)
- VoiceOver accessible

#### Caregiver/Therapist Mode (Settings & Analysis)
- Set current prompt level phase
- Configure reward system
- View detailed statistics and progress
- Recordings library
- Export data for therapy sessions
- Customize characters and themes

### Project Structure

```
HelpSeeker/
├── Models/
│   ├── HelpRequest.swift           // Each time child taps help
│   ├── PromptLevel.swift           // Current intervention phase
│   ├── RewardProgress.swift        // Points, streaks, achievements
│   ├── VoiceRecording.swift        // Audio metadata
│   └── DailyStats.swift            // Aggregated daily statistics
├── Views/
│   ├── Child/
│   │   ├── ChildHomeView.swift     // Main child interface
│   │   ├── HelpButtonView.swift    // Prominent help button
│   │   ├── CharacterView.swift     // Animated companion
│   │   ├── RewardDisplayView.swift // Points, streaks visible
│   │   ├── CelebrationView.swift   // Success animations
│   │   └── OnboardingView.swift    // First-time tutorial
│   └── Caregiver/
│       ├── CaregiverDashboard.swift // Overview & stats
│       ├── PromptLevelSettings.swift // Set intervention phase
│       ├── ProgressChartsView.swift // Trend graphs
│       ├── RecordingsLibrary.swift  // Voice recordings
│       ├── ExportDataView.swift     // CSV export
│       └── SettingsView.swift       // App configuration
├── Services/
│   ├── InterventionManager.swift   // Controls prompt fading
│   ├── RewardSystem.swift          // Points, achievements logic
│   ├── CelebrationEngine.swift      // Animations & effects
│   ├── CharacterEngine.swift       // Companion behavior
│   ├── AudioRecorder.swift         // Voice recording (AVFoundation)
│   ├── AudioPlayer.swift           // Playback for caregivers
│   ├── ProgressTracker.swift       // Statistics & analytics
│   └── SpeechSynthesizer.swift     // Text-to-speech (AVSpeechSynthesizer)
├── Utilities/
│   ├── Constants.swift             // App configuration
│   ├── Extensions.swift            // Helper functions
│   └── AppSettings.swift           // UserDefaults wrapper
└── Resources/
    ├── Sounds/                      // Reward sounds, prompts
    ├── Animations/                  // Celebration effects
    ├── Characters/                  // Companion graphics
    └── Assets.xcassets/            // Images, colors
```

---

## Detailed Interaction Flows

### Scenario 1: Phase 1 (Full Prompt - Beginning)

1. Child opens app
2. Screen shows:
   - Large pulsing help button in center
   - Text prompt: "Do you need help?"
   - App speaks: "Do you need help? Tap here if you do!"
   - Character companion waves and gestures toward button
3. Adult may verbally reinforce: "If you need help, press the button"
4. Child taps help button → **IMMEDIATE RESPONSE**:
   - Celebration animation (confetti, stars, 3-5 seconds)
   - Character cheers and dances
   - "Great job asking for help!" spoken
   - +10 points/stars awarded
   - Streak increments
   - Voice recording starts (child can verbalize need)
5. Adult responds to child's real-world help request

### Scenario 2: Phase 4 (No Prompt - Target Behavior)

1. Child opens app
2. Simple help button visible (no text prompts, no audio prompts)
3. Child independently taps help button when they need it
4. Same immediate reward system activates
5. **Key difference**: Child acted entirely on their own = stronger reinforcement + "Independence Champion" achievement potential

---

## Reinforcement System Details

### Immediate Reinforcement (Per Help Request)
- Visual celebration (3-5 seconds)
- Audio praise (text-to-speech)
- +10 points/stars
- Streak increment (if within same day)
- Character celebration animation

### Delayed Reinforcement (Session-Based)
- Daily summary: "You asked for help 3 times today! Amazing!"
- Weekly achievements unlock new rewards
- Progress toward next level displayed
- "Independence milestones" celebration

### Variable Ratio Schedule (Behavioral Psychology)
- Occasionally give **extra special rewards** (bonus points, special animation)
- Unpredictability increases motivation and engagement
- Example: Every ~5-10 requests, give "SUPER MEGA BONUS!" surprise

---

## Customization Options

| Setting | Options | Purpose |
|---------|---------|---------|
| **Prompt Level** | Phase 1-4 | Control intervention intensity |
| **Prompt Advancement** | Time-based / Performance-based / Manual / Hybrid | How child progresses |
| **Reward Type** | Points, stickers, character accessories | Match child's motivation |
| **Celebration Duration** | 2-10 seconds | Balance reinforcement vs. flow |
| **Audio Volume** | Off/Soft/Medium/Loud | Sensory considerations |
| **Character Selection** | Multiple options | Personalization |
| **Sensitivity** | How quickly prompts fade | Tailor to child's progress |

---

## Technical Stack

### Frameworks & Libraries
- **SwiftUI** - Modern, declarative UI framework (iPad-optimized)
- **SwiftData** - Native persistence (iOS 17+), simpler than Core Data
- **AVFoundation** - Audio recording (AVAudioRecorder) and playback (AVAudioPlayer)
- **AVSpeechSynthesizer** - Text-to-speech for prompts and praise
- **Charts** - Native SwiftUI charts for progress visualization (iOS 16+)
- **LocalAuthentication** - Secure caregiver mode access (Face ID/Touch ID)

### Key Technical Decisions

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| UI Framework | SwiftUI | Modern, iPad-optimized, easy customization |
| Persistence | SwiftData | Simpler than Core Data, iOS 17+ native |
| Audio | AVFoundation | Robust, native, low-latency |
| Analytics | Local only | Privacy-focused, no backend needed |
| Deployment | iPad only | Optimized for target device |
| Accessibility | First-class | VoiceOver, Dynamic Type, Reduce Motion |

---

## Implementation Phases

### Phase 1: Foundation (MVP)
1. Create Xcode project with SwiftUI + iPad target
2. Build main child interface with help button
3. Implement basic prompt system (Phase 1 only)
4. Add immediate reinforcement (celebration + audio)
5. Implement AVAudioRecorder for voice capture
6. Set up SwiftData models for basic tracking
7. Create simple caregiver settings screen

### Phase 2: Gamification & Progress
1. Implement reward points system
2. Add character companion with animations
3. Create achievement system with badges
4. Build streak counter
5. Implement all 4 prompt phases
6. Add prompt fading logic

### Phase 3: Analytics & Data
1. Build statistics calculation engine
2. Create progress charts (daily/weekly trends)
3. Implement latency measurement
4. Build recordings library for caregivers
5. Add CSV export functionality
6. Create caregiver dashboard

### Phase 4: Polish & Accessibility
1. Add VoiceOver support throughout
2. Implement Dynamic Type scaling
3. Add visual/audio feedback refinements
4. Settings screen for full customization
5. Guided Access mode support
6. Multiple language support (internationalization)
7. Dark mode support

### Phase 5: Advanced Features
1. Customizable button grid (add/edit buttons beyond "help")
2. Multiple user profiles support
3. Remote notifications for caregivers (optional)
4. Data sync between devices (iCloud)
5. More complex character behaviors
6. Additional reward types

---

## Open Source Considerations

### License
- **MIT License** for maximum compatibility and adoption
- Allows commercial use, modifications, distribution

### Documentation
- Comprehensive README with setup instructions
- Sample data for testing
- Accessibility documentation
- Contribution guidelines
- Architecture decision records

### Community Features
- Issue templates for bug reports and feature requests
- Pull request template
- Code of conduct
- Discussion forums for questions

---

## Design Questions (To Be Decided)

### Prompt Fading Strategy
- [ ] Time-based: Automatically advance phases after X weeks of success
- [ ] Performance-based: Require X% independent actions before advancing
- [ ] Manual: Caregiver decides when to advance
- [ ] Hybrid: System suggests advancement, caregiver confirms

### Reinforcement Preference
- [ ] Extrinsic rewards only (points, badges, virtual items)
- [ ] Social reinforcement (celebrations, praise from character)
- [ ] Mixed (both virtual and social)
- [ ] Minimal (subtle acknowledgment, focus on real-world outcome)

### Character Companion
- [ ] Cute animal (bear, dog, cat - universally appealing)
- [ ] Fantasy creature (friendly monster, robot - imaginative)
- [ ] Human character (relatable)
- [ ] No character (focus on button and rewards only)

### Recording Behavior
- [ ] Always record when help button is pressed (complete data)
- [ ] Prompt to record (optional, ask caregiver)
- [ ] Recording only when caregiver mode active
- [ ] No recording by default (privacy-focused)

---

## Success Metrics

### For the Child
- Increased frequency of independent help-seeking
- Reduced reliance on adult prompts
- Faster response to needs (shorter latency)
- Generalization to real-world contexts

### For the App
- High engagement (daily usage)
- Progression through phases
- Achievement of Phase 4 independence
- Caregiver satisfaction (useful analytics)

---

## Next Steps

1. Review and approve this plan
2. Decide on design questions above
3. Begin implementation with Phase 1 (Foundation/MVP)
4. Iterate based on feedback from potential users (caregivers, therapists, children)

---

## Resources & References

### Behavioral Psychology
- Applied Behavior Analysis (ABA) principles
- Prompt fading techniques
- Positive reinforcement schedules
- Shaping methodology

### Technical Resources
- SwiftUI documentation (Apple)
- SwiftData documentation (Apple)
- AVFoundation framework
- VoiceOver accessibility guidelines

---

*Document created: January 21, 2026*
*Version: 1.0*
