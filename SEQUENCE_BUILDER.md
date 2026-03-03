# SequenceBuilder - Visual Sequencing Application

## Overview

**SequenceBuilder** is a therapeutic application for the SpectrumSkills platform that helps children learn and practice visual sequencing of daily routines and tasks. Through drag-and-drop pictogram ordering, children develop executive function skills, task planning abilities, and routine comprehension.

## Core Concept

Children arrange pictograms in the correct order to complete a task or routine (e.g., bedtime routine, morning routine, washing hands). The app provides:

- **Visual pictogram sequences** for common daily activities
- **Custom sequence creation** by therapists for individual needs
- **Multiple valid order support** when applicable (e.g., brush teeth before or after breakfast)
- **Speech integration** - child says each step aloud before moving to next
- **Progressive difficulty** - from 3-step to 10+ step sequences

## How It Works

### Child Experience Flow

```
1. Select a sequence (e.g., "Bedtime Routine")
        ↓
2. See available pictograms at bottom
        ↓
3. Drag pictograms to top in correct order
        ↓
4. Say each step out loud (if speech enabled)
        ↓
5. System verifies order
        ↓
6a. ✅ Correct order → Celebration + Stars earned!
6b. ⚠️ Partial order → "Almost! Try moving this step"
6c. ❌ Incorrect → Gentle correction with hints
```

### Example: Bedtime Routine

**Task**: Put these steps in order for bedtime

**Available Steps**:
- 👕 Change into pajamas
- 🪥 Brush teeth
- 📖 Read a story
- 💡 Turn off lights
- 🌙 Say good night

**Correct Order**: 1→2→3→4→5 (linear sequence)

**Alternative Valid Order**: Some steps can be swapped (e.g., read story before or after brushing)

### Example: Washing Hands

**Task**: How do you wash your hands properly?

**Steps**:
1. Turn on water 🚰
2. Wet hands 💧
3. Get soap 🧼
4. Rub hands together 👏
5. Rinse hands 💦
6. Dry hands 🧻
7. Turn off water 🚰

**Note**: This sequence has a strict order - no steps can be swapped!

## Key Features

### For Children

1. **Drag & Drop Interface**
   - Touch-friendly pictogram dragging
   - Visual feedback during drag
   - Snap-to-place when near correct position

2. **Speech Integration**
   - Say each step before dragging (configurable)
   - Speech recognition verifies pronunciation
   - "Step 1: Change into pajamas" → Child: "Change into pajamas" → Drag pictogram

3. **Progressive Hints**
   - Level 1: Show first step highlighted
   - Level 2: Highlight category (first vs. last steps)
   - Level 3: No hints (full independence)

4. **Celebrations**
   - Character celebration for each correct step
   - Big celebration for completed sequence
   - Stars earned based on accuracy and speed

5. **Categories of Sequences**
   - Daily routines (morning, bedtime, mealtime)
   - Self-care (washing hands, brushing teeth, getting dressed)
   - Household tasks (setting table, cleaning up, laundry)
   - School routines (packing bag, homework routine)
   - Social sequences (birthday party, going to pool)

### For Therapists

1. **Custom Sequence Builder**
   ```
   Create New Sequence:
   - Title: "Pool Routine"
   - Steps:
     1. 🩳 Change into swimsuit
     2. 🧴 Apply sunscreen
     3. 👙 Put on swim cap
     4. 🥽 Get goggles
     5. 🏊 Jump in pool!
   - Options:
     ☑ Allow multiple valid orders
     ☑ Require speech for each step
     ☐ Must complete all steps
   ```

2. **Pictogram Library**
   - 500+ built-in pictograms
   - Upload custom photos (e.g., child's actual bedroom)
   - Custom audio recordings for each step

3. **Multiple Valid Orders**
   ```
   Morning Routine:
   Valid Order A: Wake → Dress → Eat → Brush → Pack
   Valid Order B: Wake → Eat → Dress → Brush → Pack
   
   Therapist marks: "Dress" and "Eat" can be swapped
   ```

4. **Difficulty Settings**
   - Number of steps: 3, 4, 5, 6, 7, 8, 9, 10+
   - Visual complexity: Real photos vs. simple icons
   - Time limit: Optional countdown timer
   - Hints: Number and type of hints provided

5. **Progress Tracking**
   - Mastery per sequence type
   - Time to complete (improving efficiency)
   - Number of hints needed (increasing independence)
   - Speech attempts and success rate

6. **IEP Goal Alignment**
   - Link sequences to specific goals
   - Track goal progress through sequence completion
   - Export data for IEP meetings

## Speech Integration

### How Speech Works in SequenceBuilder

**Option 1: Say Before Drag** (Recommended)
```
Child sees: Step 1 slot (empty)
Prompt: "🎤 Say what you do first!"
Child says: "Change into pajamas"
Recognition: ✅ "Change into pajamas" recognized
Action: Child now drags 👕 pictogram to Step 1
```

**Option 2: Say After Drag**
```
Child drags 👕 pictogram to Step 1
Prompt: "🎤 Say what this step is!"
Child says: "Change into pajamas"
Recognition: ✅ Verified
```

**Option 3: Say At Completion**
```
Child completes sequence ordering
Prompt: "🎤 Read all the steps out loud!"
Child says: "Change, brush, story, lights, good night"
Recognition: ✅ All steps verified
```

### Therapist Configuration

```
Speech Settings for SequenceBuilder:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☑ Enable speech integration

Speech Mode: [Say Before Drag ▼]
• Say Before Drag: Say it, then drag it
• Say After Drag: Drag it, then say it
• Say At Completion: Say all steps at end
• Disabled: No speech required

Allow skip: [✓ Yes ▼]
☑ Show "Say it for me" button
☑ Show visual hint (text label)

Recognition: [Normal ▼]
• Lenient: Accept partial matches
• Normal: Standard recognition
• Strict: Requires clear speech
```

## Evidence Base

### TEACCH Structured Teaching
- Visual schedules reduce anxiety
- Clear beginning, middle, end
- Predictable sequences

### Task Analysis
- Breaking routines into steps
- Sequential learning
- Skill building through repetition

### Executive Function Training
- Planning and sequencing
- Working memory
- Cognitive flexibility (when multiple orders valid)

### Visual Learning
- Pictograms support comprehension
- Visual processing strengths in autism
- Concrete representations of abstract concepts

## Built-In Sequence Library

### Daily Routines (12 sequences)
1. **Bedtime Routine** (7 steps)
2. **Morning Routine** (6 steps)
3. **Getting Dressed** (5 steps)
4. **Washing Hands** (6 steps)
5. **Brushing Teeth** (5 steps)
6. **Taking a Bath** (6 steps)
7. **Mealtime Routine** (5 steps)
8. **Setting the Table** (5 steps)
9. **Cleaning Up Toys** (4 steps)
10. **Making the Bed** (5 steps)
11. **Homework Routine** (6 steps)
12. **Getting Ready for School** (7 steps)

### Social Situations (8 sequences)
1. **Going to a Birthday Party** (8 steps)
2. **Swimming at the Pool** (6 steps)
3. **Going to the Doctor** (7 steps)
4. **Going to a Restaurant** (6 steps)
5. **Visiting a Friend** (5 steps)
6. **Going Shopping** (7 steps)
7. **Going to the Movies** (6 steps)
8. **Playing at the Park** (5 steps)

### School Routines (10 sequences)
1. **Arriving at School** (5 steps)
2. **Lunchtime Routine** (6 steps)
3. **Packing Backpack** (5 steps)
4. **Group Work** (4 steps)
5. **Fire Drill** (5 steps)
6. **Assembly Behavior** (4 steps)
7. **Asking for Help** (4 steps)
8. **Transitioning Between Classes** (5 steps)
9. **Using the Bathroom** (5 steps)
10. **Going Home** (4 steps)

### Self-Care (10 sequences)
1. **Tying Shoes** (6 steps)
2. **Blowing Nose** (4 steps)
3. **Washing Face** (5 steps)
4. **Combing Hair** (4 steps)
5. **Applying Lotion** (4 steps)
6. **Cutting Food** (5 steps)
7. **Opening Containers** (4 steps)
8. **Zipping a Jacket** (4 steps)
9. **Buttoning a Shirt** (5 steps)
10. **Using a Tissue** (3 steps)

## Age Adaptations

### Ages 6-7 (Beginner)
- **3-4 step sequences**
- Large, simple pictograms
- First/last steps highlighted
- Audio prompts for each step
- Verbal labels shown

### Ages 8-9 (Intermediate)
- **5-6 step sequences**
- Smaller pictograms, more per screen
- Category hints ("First things" vs "Last things")
- Optional audio prompts
- Some flexible ordering introduced

### Ages 10-12 (Advanced)
- **7-10+ step sequences**
- Complex multi-step routines
- No hints provided
- Multiple valid orders
- Time challenges (optional)
- Create own sequences

## Technical Implementation

### Data Model

```swift
// Domain Layer
public struct Sequence: Identifiable {
    public let id: SequenceID
    public let title: LocalizedString
    public let description: String?
    public let category: SequenceCategory
    public let difficulty: DifficultyLevel
    public let steps: [SequenceStep]
    public let validOrderings: [[Int]]  // Multiple valid sequences
    public let isCustom: Bool
}

public struct SequenceStep: Identifiable {
    public let id: StepID
    public let order: Int
    public let pictogram: Pictogram
    public let label: LocalizedString
    public let audioPrompt: AudioResource?
}

public struct Pictogram {
    public let image: ImageResource
    public let category: PictogramCategory
    public let isCustom: Bool
}

// Valid orderings example:
// [[1,2,3,4,5], [1,3,2,4,5]] 
// Steps 2 and 3 can be swapped
```

### Gameplay Logic

```swift
class SequenceGameplayUseCase {
    func validateOrder(selectedOrder: [StepID], 
                      sequence: Sequence) -> ValidationResult {
        
        // Check if order matches any valid ordering
        for validOrdering in sequence.validOrderings {
            if matchesOrdering(selectedOrder, validOrdering) {
                return .correct
            }
        }
        
        // Check for partial correctness
        let correctCount = countCorrectlyPlacedSteps(selectedOrder)
        let totalSteps = sequence.steps.count
        
        if correctCount == 0 {
            return .incorrect(hints: provideHints(sequence))
        } else if correctCount < totalSteps {
            return .partial(correctCount: correctCount, 
                          hints: provideHints(sequence, selectedOrder))
        }
        
        return .incorrect(hints: provideHints(sequence))
    }
    
    private func provideHints(sequence: Sequence, 
                             currentOrder: [StepID]? = nil) -> [Hint] {
        var hints: [Hint] = []
        
        // Hint 1: Show first step
        hints.append(.showFirstStep(sequence.steps.first!))
        
        // Hint 2: Show last step
        hints.append(.showLastStep(sequence.steps.last!))
        
        // Hint 3: Categorize (if applicable)
        if sequence.steps.count > 4 {
            hints.append(.categoryHint("Think about what you do first"))
        }
        
        return hints
    }
}
```

### SwiftData Models

```swift
@Model
final class SequenceAttemptModel {
    @Attribute(.unique) var id: UUID
    var sequenceId: String
    var childProfileId: UUID
    var timestamp: Date
    var completionTime: TimeInterval
    var numberOfHintsUsed: Int
    var numberOfAttempts: Int
    var wasSuccessful: Bool
    var speechAttempts: Int
    var speechSuccessRate: Double
}

@Model
final class CustomSequenceModel {
    @Attribute(.unique) var id: UUID
    var title: String
    var createdByTherapist: Bool
    var therapistId: UUID?
    var stepsData: Data  // Encoded [SequenceStep]
    var validOrderingsData: Data  // Encoded [[Int]]
    var isActive: Bool
}
```

## Integration with Platform

### Unified Reward System
- Complete sequences → Earn stars
- Stars unlock games in shared library
- Progress tracked across all apps

### Speech Integration
- Uses platform speech recognition
- Configurable per sequence
- Settings shared with other apps

### Character System
- Character guides child through sequences
- Celebrates completion
- Provides encouragement

### Progress Tracking
- Unified progress dashboard
- IEP goal alignment
- Data export for therapists

## Use Cases

### Case 1: Bedtime Anxiety
**Child**: 7-year-old with bedtime resistance
**Therapist**: Creates "Bedtime Routine" sequence
**Usage**: Child practices sequence daily before actual bedtime
**Result**: Predictable routine reduces anxiety, child feels in control

### Case 2: Morning Independence
**Child**: 9-year-old needs prompts for each morning task
**Parent**: Uses "Morning Routine" sequence
**Usage**: Child completes sequence independently, checking off each step
**Result**: Reduced parent prompting, increased independence

### Case 3: School Transition
**Child**: 6-year-old starting school, anxious about new routines
**Therapist**: Practices "Arriving at School" sequence
**Usage**: Role-play sequence before first day
**Result**: Familiarity with routine reduces first-day anxiety

### Case 4: Hand Washing Compliance
**Child**: 8-year-old rushes through hand washing
**Therapist**: Uses "Washing Hands" sequence with speech
**Usage**: Child says each step out loud while doing it
**Result**: Improved thoroughness, better hygiene habits

## Benefits

### For Children
- **Independence**: Learn to complete routines without constant prompting
- **Confidence**: Mastery of sequences builds self-efficacy
- **Reduced Anxiety**: Predictable routines reduce uncertainty
- **Skill Generalization**: Practice in app transfers to real life

### For Parents
- **Reduced Nagging**: Visual sequences replace verbal prompts
- **Consistency**: Same routine every time
- **Peace of Mind**: Child can follow sequences independently
- **Progress Tracking**: See improvement over time

### For Therapists
- **Customizable**: Create sequences for specific child needs
- **Data-Driven**: Track progress objectively
- **IEP Alignment**: Directly link to functional goals
- **Generalization Tool**: Bridge between therapy and home

## Future Enhancements

1. **Photo Sequences**: Use child's actual environment photos
2. **Video Modeling**: Video of each step for complex tasks
3. **Timer Integration**: Time each step for efficiency training
4. **Social Stories**: Combine with SocialStories app for context
5. **Community Library**: Share sequences between therapists
6. **Adaptive Difficulty**: AI adjusts difficulty based on performance

## Summary

SequenceBuilder transforms abstract routines into concrete, visual, interactive learning experiences. By breaking down daily activities into manageable steps, children develop independence, reduce anxiety, and build life skills that transfer directly to real-world situations.

**Key Strengths**:
- ✅ Visual learning approach
- ✅ Speech integration for communication practice
- ✅ Therapist customization
- ✅ Multiple valid orders (realistic flexibility)
- ✅ Progress tracking and IEP alignment
- ✅ Part of unified platform (shared rewards, character, progress)

**Target Outcomes**:
- Independent completion of daily routines
- Reduced caregiver prompting
- Improved executive function
- Better task planning and sequencing
- Increased confidence in daily activities
