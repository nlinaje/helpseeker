# Executive Summary: SpectrumSkills Platform

## Quick Overview

**SpectrumSkills** is an open-source therapeutic platform for children with autism (ages 6-12). HelpSeeker—the first app—is currently in development and focuses on teaching help-seeking skills through interactive scenarios.

This document provides a roadmap for expanding HelpSeeker into a comprehensive platform with multiple evidence-based therapeutic applications.

---

## The Vision

### Problem
Children with autism face challenges in:
- Asking for help (HelpSeeker focus)
- Emotional regulation
- Daily living skills
- Social understanding
- Communication

Parents and therapists lack accessible, evidence-based digital tools for consistent practice.

### Solution
A unified platform of therapeutic apps featuring:
- **Consistent companion character** across all apps
- **Evidence-based interventions** (ABA, TEACCH, PECS, etc.)
- **Educational reward games** unlocked through progress
- **Privacy-first design** (local data, no cloud)
- **Open source** (AGPLv3 code, CC0 assets)

---

## Platform Architecture

### Brand Identity
- **Name**: SpectrumSkills
- **Logo**: Abstract, friendly character icon
- **Colors**: Calm Blue, Growth Green, Warm Orange
- **Character**: Customizable companion (animal, robot, fantasy, abstract)
- **Values**: Evidence-based, child-centered, privacy-first, inclusive

### Technical Foundation
```
spectrum-skills/ (GitHub Organization)
├── platform-core/          # Shared Swift package
│   ├── Domain Layer        # Entities, Value Objects
│   ├── Infrastructure      # SwiftData, Speech, Content
│   └── Shared UI           # Components, Design System
│
├── apps/
│   ├── help-seeker/        # App 1: Asking for help (IN DEV)
│   ├── emotion-explorer/   # App 2: Emotional regulation (PLANNED)
│   ├── daily-living/       # App 3: Self-care skills (PLANNED)
│   ├── social-stories/     # App 4: Social understanding (PLANNED)
│   ├── play-partner/       # App 5: Play skills (PLANNED)
│   ├── schedule-mate/      # App 6: Visual schedules (PLANNED)
│   └── communicator/       # App 7: AAC (PLANNED)
│
├── assets/                 # CC0 character assets, sounds
├── content/                # Scenarios, stories, translations
├── documentation/          # Research, design, API docs
└── tools/                  # Validators, generators
```

### Unified Character System
- **Same character** appears in all apps
- **Customizable**: Type, name, colors, outfits
- **Progressive**: Character grows with child
- **Emotional**: Shows relevant expressions
- **Rewarding**: Celebrates achievements

---

## Educational Reward Games - Unified Platform Library

**Key Principle**: All SpectrumSkills applications share a **single, unified reward games library**. Games unlocked in one app are immediately available in all other apps.

### How It Works
- Child plays HelpSeeker → Unlocks "Letter Match" → Available in ALL apps
- Child plays EmotionExplorer → Progress adds to shared star count
- Child plays DailyLiving → Unlocks new games for entire platform
- New games added to platform → Available in ALL apps immediately

### Game Categories (Shared Across All Apps)
1. **LetterGames**: Letter recognition, tracing, word building (with speech: say letters)
2. **NumberGames**: Counting, operations, patterns (with speech: say numbers)
3. **SoundGames**: Instrument/animal sound matching (with speech: say sound source)
4. **SpatialGames**: Prepositions (in front, behind, below) (with speech: say position)
5. **LogicGames**: Patterns, sorting, mazes (with speech: say answers)
6. **MemoryGames**: Matching pairs, sequence recall (with speech: say card names)

### Speech Integration in All Games
**All games require speech by default** - children say answers/names out loud before continuing. Examples:
- **Memory**: "Apple" (say the card name)
- **Math**: "Four" (say the answer)
- **Letters**: "B" (say the letter)

**Therapist Control**: Speech requirement can be disabled globally or per game based on child's needs.

### Benefits
- ✅ No duplicate reward systems across apps
- ✅ Seamless experience switching between apps
- ✅ Therapist can use multiple apps with unified rewards
- ✅ All platform updates benefit every app

### Age Adaptation
- **Ages 6-7**: Letters A-Z, numbers 1-10, basic concepts
- **Ages 8-9**: Words, operations, spatial terms
- **Ages 10-12**: Multiplication, logic, fractions

---

## Evidence Base

### Strong Evidence (★★★)
- ABA (Applied Behavior Analysis)
- Discrete Trial Training
- Visual Supports
- PECS (Picture Exchange)
- Task Analysis
- Video Modeling

### Moderate Evidence (★★)
- TEACCH Structured Teaching
- Social Stories™
- CBT Adaptations
- Executive Function Training

---

## App Ecosystem

### 1. HelpSeeker (CURRENT - In Development)
**Focus**: Asking for help  
**Evidence**: DTT, functional communication training  
**Features**:
- 20 scenarios (physical, academic, social, emotional)
- Choice & speech response modes
- Progressive difficulty
- Character celebrations
- Unlock reward games

**Availability**: Completely free, open source (AGPLv3)

### 2. EmotionExplorer (PLANNED)
**Focus**: Emotional identification & regulation  
**Evidence**: Zones of Regulation, CBT adaptations  
**Features**:
- Zone identification (Blue, Green, Yellow, Red)
- Emotion recognition in faces/body
- Coping strategy toolbox
- Emotion diary with graphs

**Availability**: Completely free, open source (AGPLv3)

### 3. DailyLiving (PLANNED)
**Focus**: Self-care skills  
**Evidence**: Task analysis, chaining, video modeling  
**Features**:
- Dressing, grooming, hygiene sequences
- Step-by-step visuals
- Video modeling
- Printable checklists

**Availability**: Completely free, open source (AGPLv3)

### 4. SocialStories (PLANNED)
**Focus**: Social understanding  
**Evidence**: Social Stories™ by Carol Gray  
**Features**:
- Pre-made story library
- Custom story creator
- Personalization (photos, names)
- Comprehension checks

**Availability**: Completely free, open source (AGPLv3)

### 5. PlayPartner (PLANNED)
**Focus**: Play skills  
**Evidence**: Video modeling, structured play  
**Features**:
- Functional play activities
- Pretend play scenarios
- Turn-taking games
- Social scripts

**Availability**: Completely free, open source (AGPLv3)

### 6. ScheduleMate (PLANNED)
**Focus**: Visual schedules & transitions  
**Evidence**: TEACCH structured teaching  
**Features**:
- Visual timetables
- First/Then boards
- Countdown timers
- Transition warnings

**Availability**: Completely free, open source (AGPLv3)

### 7. Communicator (PLANNED)
**Focus**: AAC & communication  
**Evidence**: PECS, aided language stimulation  
**Features**:
- PECS-style picture exchange
- Symbol categories
- Sentence building
- Voice output

**Availability**: Completely free, open source (AGPLv3)

### 8. SequenceBuilder (NEW)
**Focus**: Visual sequencing and task ordering  
**Evidence**: TEACCH work systems, task analysis  
**Features**:
- **Visual Sequences**: Order pictograms to complete routines (bedtime, morning, etc.)
- **Custom Scenarios**: Therapist creates sequences with pictograms
- **Multiple Valid Orders**: Accepts different correct sequences when applicable
- **Speech Integration**: Child says each step aloud before moving to next
- **Examples**: Bedtime routine (change → brush → read → lights off → good night)
- **Real-World Practice**: Learn sequences before doing them in real life

**Availability**: Completely free, open source (AGPLv3)

---

## Development Roadmap

### Phase 1: Foundation (Months 1-3)
- [ ] Set up GitHub organization (spectrum-skills)
- [ ] Design logo and brand identity
- [ ] Implement platform-core Swift package
- [ ] Create character system
- [ ] Begin HelpSeeker development

### Phase 2: Launch (Months 4-6)
- [ ] Complete HelpSeeker MVP
- [ ] Beta testing with 50 families
- [ ] Create 20 scenarios
- [ ] Build character asset library
- [ ] 🚀 **RELEASE: HelpSeeker v1.0**

### Phase 3: Expansion (Months 7-12)
- [ ] EmotionExplorer development
- [ ] DailyLiving development
- [ ] Cross-app integration
- [ ] Community contribution system
- [ ] German & Spanish translation
- [ ] 🚀 **RELEASE: 2-3 additional apps**

### Phase 4: Growth (Months 13-18)
- [ ] SocialStories, PlayPartner, ScheduleMate
- [ ] Communicator development
- [ ] Research partnerships
- [ ] Therapist dashboard
- [ ] Additional languages (IT, FR, EN)
- [ ] 🚀 **RELEASE: Full platform (7 apps)**

### Future Phases (Year 2+)
- [ ] ML-based difficulty adaptation
- [ ] Community content marketplace
- [ ] Outcome tracking & research
- [ ] Additional therapeutic areas

---

## Key Resources Created

### Documentation
1. **README.md** - Non-technical project overview
2. **AGENTS.md** - Development guidelines & architecture
3. **RESEARCH_SUMMARY.md** - Evidence-based interventions
4. **PLATFORM_GUIDE.md** - Technical architecture & branding
5. **PLATFORM_OVERVIEW.md** - Visual diagrams & ecosystem

### Code Foundation
- Hexagonal Architecture (Domain/Application/Infrastructure)
- SwiftData for persistence
- Modular app structure
- Shared components library

---

## Immediate Next Steps

### Week 1: Setup
1. Create GitHub organization: `spectrum-skills`
2. Register domain: `spectrum-skills.org`
3. Design logo and brand assets
4. Set up development environment
5. Create platform-core repository

### Week 2: Foundation
1. Implement domain layer (entities, value objects)
2. Create character entity and types
3. Design character illustrations (4 base types)
4. Set up SwiftData models
5. Begin HelpSeeker scaffolding

### Week 3: Character System
1. Build character customization UI
2. Create character expressions (6 types)
3. Implement outfit system
4. Design celebration animations
5. Character integration with HelpSeeker

### Week 4: Content Creation
1. Write 20 help-seeking scenarios
2. Translate to German and Spanish
3. Create scenario illustrations
4. Validate against JSON schema
5. Record audio for scenarios

### Week 5: Core Features
1. Implement scenario gameplay
2. Build choice mode UI
3. Integrate speech recognition
4. Create progress tracking
5. Build celebration system

### Week 6: Polish & Testing
1. Beta testing with 5 families
2. Fix bugs and refine UX
3. Accessibility audit
4. Performance optimization
5. Prepare App Store materials

---

## Therapist & Parent Planning Dashboard

### Overview
A comprehensive planning interface allows therapists and parents to pre-configure all therapeutic activities before the child begins. This enables structured, goal-oriented therapy sessions and consistent practice across settings.

### Key Features
- **Session Planning**: Pre-select scenarios, tasks, and reward games
- **Weekly Scheduling**: Plan recurring sessions and activities
- **Content Curation**: Filter and select specific scenarios by category/difficulty
- **Goal Alignment**: Link activities to IEP goals and track mastery
- **Child Mode Lockdown**: Child sees ONLY pre-selected activities
- **Progress Tracking**: Real-time updates and trend analysis
- **Multi-User Collaboration**: Therapist and parent share plans and progress

### Benefits
1. **Structured Therapy**: Pre-planned sessions ensure focus
2. **Consistency**: Same activities at home and therapy
3. **Goal Alignment**: Activities directly support IEP goals
4. **Reduced Anxiety**: Child knows what to expect
5. **Data-Driven**: Adjust plans based on actual progress

---

## License & Philosophy

### Completely Free & Open Source
**ALL applications are 100% FREE**:
- ✓ No payments required
- ✓ No subscriptions
- ✓ No advertisements
- ✓ No in-app purchases
- ✓ No premium features
- ✓ No content restrictions

### Open Source Commitment
- **Code**: AGPLv3 (free to use, modify, share)
- **Assets**: CC0 (public domain)
- **Content**: Community-created, freely available
- **Scenarios**: Anyone can contribute, no payment expected

### Why Free?
Therapeutic tools should be accessible to ALL families, regardless of financial situation. Open source enables:
- Global collaboration
- Community contributions
- Transparency and trust
- Sustainability through community

---

## Community & Open Source

### Contribution Areas
1. **Code**: Bug fixes, features, accessibility
2. **Content**: Scenarios, stories, translations
3. **Assets**: Characters, sounds, outfits
4. **Research**: Evidence updates, best practices

### Recognition
- Contributors list in app
- Attribution in documentation
- Community spotlight
- Annual contributor awards

### Research Partnerships
- Universities
- Autism research centers
- Therapy clinics
- Special education schools

---

## Success Metrics

### Platform Level
- Monthly active users
- Cross-app adoption rate
- User retention (30-day, 90-day)
- Community contribution rate

### Therapeutic Impact
- Skill acquisition rates
- Generalization to real-world
- Parent/therapist satisfaction
- Reduced anxiety reports
- Increased independence

---

## Why This Matters

The SpectrumSkills platform addresses critical gaps in autism support:

1. **Accessibility**: Affordable alternatives to expensive therapy tools
2. **Consistency**: Therapeutic practice available 24/7 at home
3. **Evidence**: Every intervention backed by research
4. **Privacy**: Local data storage, no tracking
5. **Community**: Open source enables global collaboration
6. **Growth**: Platform expands with child's needs

HelpSeeker is the foundation. The platform grows from here.

---

## Contact & Resources

**Platform**: SpectrumSkills  
**Repository**: github.com/spectrum-skills  
**Website**: spectrum-skills.org (future)  
**License**: AGPLv3 (code), CC0 (assets)  

**Languages Priority**: German (DE), Spanish (ES), Italian (IT), English (EN), French (FR)

---

*"Every child deserves tools that help them grow. SpectrumSkills makes evidence-based therapy accessible, engaging, and privacy-respecting."*
