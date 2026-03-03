# HelpSeeker - Design Decisions Needed

This file tracks the key design decisions that need to be made before or during implementation.

---

## Decision 1: Prompt Fading Strategy

How should the app handle progression through the 4 phases?

### Options:
- **Time-based**: Automatically advance phases after X weeks of success
- **Performance-based**: Require X% independent actions before advancing
- **Manual**: Caregiver decides when to advance
- **Hybrid**: System suggests advancement, caregiver confirms

### Status: [PENDING]
### Notes:
- Performance-based may be most aligned with ABA principles
- Hybrid approach provides both automation and caregiver control

---

## Decision 2: Reinforcement Preference

What type of reinforcement should the app provide?

### Options:
- **Extrinsic rewards only** (points, badges, virtual items)
- **Social reinforcement** (celebrations, praise from character)
- **Mixed** (both virtual and social) - RECOMMENDED
- **Minimal** (subtle acknowledgment, focus on real-world outcome)

### Status: [PENDING]
### Notes:
- Mixed approach typically most effective for engagement
- Can be customizable per child's preferences

---

## Decision 3: Character Companion

What type of character should accompany the child?

### Options:
- **Cute animal** (bear, dog, cat - universally appealing)
- **Fantasy creature** (friendly monster, robot - imaginative)
- **Human character** (relatable)
- **No character** (focus on button and rewards only)

### Status: [PENDING]
### Notes:
- Consider SF Symbols as starting point for character
- Can support multiple options with user selection

---

## Decision 4: Recording Behavior

When should voice recording occur?

### Options:
- **Always record** when help button is pressed (complete data)
- **Prompt to record** (optional, ask caregiver)
- **Recording only when caregiver mode active**
- **No recording by default** (privacy-focused)

### Status: [PENDING]
### Notes:
- Recording valuable for therapy documentation
- Privacy concerns for some families
- Could be customizable setting

---

## Decision 5: Reward Types

What rewards should be available?

### Options to consider:
- Points/stars
- Stickers
- Character accessories/costumes
- Badges/achievements
- Level progression
- Mini-games

### Status: [PENDING]
### Notes:
- Start simple, expand based on feedback
- Consider variable ratio schedule for engagement

---

## Implementation Notes

### Start with MVP (Phase 1)
- Focus on Phase 1 (full prompt) only initially
- Basic reinforcement system
- Single character option
- Simple data tracking

### Iterative Design
- Make decisions gradually as features are built
- Test with target users early
- Iterate based on feedback

---

*Last updated: January 21, 2026*
