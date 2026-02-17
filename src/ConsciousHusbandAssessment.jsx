import React, { useState, useEffect, useCallback } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

const COLORS = {
  navy: '#0D0D1A',
  surface: '#1A1A2E',
  card: '#16213E',
  elevated: '#1F2B47',
  text: '#E8E6E1',
  secondary: '#A0A0B8',
  muted: '#6A6A7A',
  placeholder: '#555566',
  gold: '#C9A227',
  goldBright: '#D4AF37',
  goldDim: '#8B7722',
  strength: '#2E7D32',
  strengthLight: '#E8F5E9',
  emerging: '#F9A825',
  emergingLight: '#FFF8E1',
  default: '#E65100',
  defaultLight: '#FFF3E0',
  blind: '#B71C1C',
  blindLight: '#FFEBEE',
  partnerPink: '#D4618C',
  partnerBlue: '#4A90D9',
  gapIndicator: '#FF6B6B',
};

const BEHAVIOR_COLORS = {
  affection: '#E07B4C',
  standards: '#9D4EDD',
  emotional: '#2A9D8F',
  listening: '#3B82F6',
  presence: '#10B981',
  purpose: '#F59E0B',
  frame: '#8B5CF6',
  grievances: '#EF4444',
};

const CATEGORY_META = {
  strength: { label: 'Conscious Strength', color: COLORS.strength, range: '13-15' },
  emerging: { label: 'Emerging Awareness', color: COLORS.emerging, range: '10-12' },
  default: { label: 'Unconscious Default', color: COLORS.default, range: '6-9' },
  blind: { label: 'Active Blind Spot', color: COLORS.blind, range: '3-5' },
};

const FONTS = {
  display: "'Cormorant Garamond', Georgia, serif",
  heading: "'Raleway', 'Helvetica Neue', sans-serif",
  body: "Georgia, 'Times New Roman', serif",
  label: "'Raleway', 'Helvetica Neue', sans-serif",
};

// ============================================================================
// BEHAVIOR DATA — ALL 8 BEHAVIORS, ALL CONTENT VERBATIM
// ============================================================================

const BEHAVIORS = [
  {
    id: 'affection',
    icon: '\u{1F932}',
    title: 'Non-Transactional Physical Affection',
    short: 'Affection',
    description: 'Touch that carries no agenda \u2014 presence expressed through the body.',
    questions: [
      {
        text: 'I touch my partner affectionately (hand on shoulder, forehead kiss, holding hands) without it being connected to wanting sex.',
        anchors: ['Rarely/Never', 'Almost Always'],
      },
      {
        text: 'My partner seems relaxed and receptive when I initiate physical contact.',
        anchors: ['She tenses up', 'She leans in'],
      },
      {
        text: 'I am intentionally aware of the difference between affectionate touch and sexual initiation.',
        anchors: ["I haven't thought about it", "I'm very conscious of it"],
      },
    ],
    profiles: {
      strength: {
        name: 'Embodied Connector',
        text: "You've built a second language of touch \u2014 one that says 'I see you' without asking for anything. Your partner's nervous system trusts your body because your body tells the truth: presence without transaction. This is rare. Protect it.",
      },
      emerging: {
        name: 'Learning the Language',
        text: "You're becoming aware that touch carries coded messages you didn't consciously write. Some of your affection lands clean. Some still carries freight. The awareness itself is the breakthrough \u2014 most men never get here.",
      },
      default: {
        name: 'Coded Touch',
        text: "Your touch has become a signal rather than a gift. Not because you're selfish \u2014 but because sexual intimacy may be the only touch vocabulary you were ever given. Her body learned to brace because your body learned to ask. This is fixable.",
      },
      blind: {
        name: 'Touch Desert',
        text: "Physical connection has narrowed to a single channel, or disappeared entirely. This isn't a character flaw \u2014 it's often the endpoint of a system where men were socialized out of casual affection by age 12. The channel needs rebuilding, not judging.",
      },
    },
    habit_stacks: [
      {
        trigger: 'Morning coffee or getting ready',
        action: 'Touch her shoulder or back for 3 seconds while passing. No words needed. No expectation attached.',
      },
      {
        trigger: 'Arriving home from work',
        action: 'Before you put anything down, make physical contact \u2014 a real hug (6+ seconds), a kiss on her temple, a hand squeeze.',
      },
      {
        trigger: 'Watching TV together',
        action: 'Put your hand on her leg or pull her feet into your lap. Let it be about proximity, not prelude.',
      },
    ],
    partner_practice: {
      title: 'The Touch Audit (Week 1-2)',
      instruction: "Together, track every touch for 3 days using a simple tally on your phone. Mark each touch as A (affection), S (sexual), or P (practical/passing). Don't judge \u2014 just count. Then share the data over dinner. The numbers tell the story without anyone having to accuse.",
      frequency: 'One 3-day audit, then monthly check-in',
    },
    mirror_question: 'When is the last time you touched her with absolutely no agenda \u2014 and she knew it?',
  },
  {
    id: 'standards',
    icon: '\u{1FA9E}',
    title: 'Personal Standards & Self-Investment',
    short: 'Standards',
    description: "The visible evidence that you haven't stopped building yourself.",
    questions: [
      {
        text: 'I maintain my physical appearance and personal grooming with the same intention I had when we first started dating.',
        anchors: ['Significantly less', 'Same or more'],
      },
      {
        text: 'I actively pursue hobbies, interests, or learning that make me a more interesting person \u2014 separate from work.',
        anchors: ["I've let them all go", "I'm actively engaged"],
      },
      {
        text: 'I dress with intention on a regular basis, not just for special occasions.',
        anchors: ["I default to whatever's clean", 'I choose deliberately'],
      },
    ],
    profiles: {
      strength: {
        name: 'Self-Authored Man',
        text: "You invest in yourself not as performance but as principle. You understand that self-maintenance is self-respect \u2014 and that self-respect is the foundation of attraction. She sees a man who hasn't stopped becoming.",
      },
      emerging: {
        name: 'Seasonal Builder',
        text: "You have seasons of investment and seasons of surrender. The awareness is there \u2014 the consistency isn't yet. The gap isn't motivation. It's probably energy management and competing demands.",
      },
      default: {
        name: 'Comfort Drift',
        text: "You've traded vitality for comfort so gradually you didn't notice the exchange. This isn't laziness \u2014 it's often the result of pouring all your maintenance energy into providing, fixing, and showing up for everyone else. Nothing was left for you.",
      },
      blind: {
        name: 'Identity Erosion',
        text: "The man she met has been slowly replaced by a role \u2014 employee, father, homeowner \u2014 without a self underneath. The hobbies are gone. The interests flattened. Not because you chose this, but because no one told you that losing yourself was the real danger.",
      },
    },
    habit_stacks: [
      {
        trigger: 'Getting dressed each morning',
        action: "'Would I wear this if I were meeting someone I wanted to impress?' If no, change one thing. Just one.",
      },
      {
        trigger: 'Sunday evening planning',
        action: "Schedule one activity this week that is yours \u2014 gym, reading, a project, a skill. Put it in the calendar like a meeting.",
      },
      {
        trigger: 'Scrolling social media',
        action: 'Replace 15 minutes of scrolling with 15 minutes of your abandoned hobby. Same chair. Same time. Different input.',
      },
    ],
    partner_practice: {
      title: 'The Attraction Conversation (Month 1)',
      instruction: "Over dinner (not in bed), ask each other: 'What first attracted you to me? What version of me do you miss most?' Listen without defending. Take notes. The gap between who you were and who you've become isn't shame \u2014 it's data.",
      frequency: "Once, then quarterly 'version check-ins'",
    },
    mirror_question: "If she described you to a stranger today, would the description sound like someone she'd want to meet?",
  },
  {
    id: 'emotional',
    icon: '\u{1F9ED}',
    title: 'Emotional Leadership',
    short: 'Emotional Lead',
    description: 'The willingness to go first into difficult emotional territory.',
    questions: [
      {
        text: 'When tension exists between us, I initiate the conversation about it rather than waiting for her to bring it up.',
        anchors: ['She always initiates', 'I go first regularly'],
      },
      {
        text: 'When she is upset, I stay present rather than withdrawing, deflecting, or becoming defensive.',
        anchors: ['I usually shut down', 'I stay engaged'],
      },
      {
        text: 'I actively manage the emotional climate of our home \u2014 noticing disconnection, naming it, and addressing it.',
        anchors: ['I leave that to her', 'I take co-ownership'],
      },
    ],
    profiles: {
      strength: {
        name: 'Emotional First Responder',
        text: "You go first. Not perfectly \u2014 but first. You've built the muscle to sit in discomfort without fleeing, and to name what's happening before it calcifies. She trusts that tension will be addressed because you've proven you won't let it fester.",
      },
      emerging: {
        name: 'Regulated Engager',
        text: "You're learning to stay. Sometimes you still withdraw when your system floods, but you come back \u2014 and you come back faster than you used to. The return is the strength, even when the departure still happens.",
      },
      default: {
        name: 'Emotional Outsourcer',
        text: "She carries the emotional weight of the relationship \u2014 initiating conversations, reading the room, translating feelings for both of you. Not because you don't care, but because your nervous system treats emotional engagement like a threat. Withdrawal feels like protection. It functions as abandonment.",
      },
      blind: {
        name: 'Emotional Absence',
        text: "You've left the emotional building. Conflict produces silence, defensiveness, or counter-attack. She's stopped bringing things up because every attempt costs more than silence. The relationship is running on her emotional labor alone, and the engine is overheating.",
      },
    },
    habit_stacks: [
      {
        trigger: 'Noticing tension (tight jaw, short answers, silence)',
        action: "Say within 1 hour: 'Something feels off between us. Can we talk about it tonight?' You don't have to solve it. You have to name it.",
      },
      {
        trigger: 'After an argument or disconnect',
        action: "Instead of waiting for it to blow over, return within 4 hours with: 'I've been thinking about what happened. Here's what I think my part was.'",
      },
      {
        trigger: 'Sunday night before the week starts',
        action: "Ask: 'How are we? Not the house. Not the kids. Us.' Then listen for 5 minutes without solving.",
      },
    ],
    partner_practice: {
      title: 'The 10-Minute Weather Report (Weekly)',
      instruction: "Every Sunday evening, take 10 minutes each. Each person reports the 'weather' of the relationship that week: sunny, cloudy, stormy, foggy. No debate about the other person's weather \u2014 just reporting. Then one sentence each: 'What would help me this week is ___.'' This externalizes the emotional audit so no one has to 'bring things up.'",
      frequency: 'Weekly \u2014 same day, same time, non-negotiable',
    },
    mirror_question: 'When was the last time you went first into a difficult conversation \u2014 before she had to drag you there?',
  },
  {
    id: 'listening',
    icon: '\u{1F442}',
    title: 'Listening vs. Fixing',
    short: 'Listening',
    description: 'The strength to hold space without rushing to resolve it.',
    questions: [
      {
        text: 'When she shares a problem or frustration, I ask what she needs (listening vs. solutions) before responding.',
        anchors: ['I jump to fixing', 'I ask first'],
      },
      {
        text: 'I can sit with her emotional pain without feeling the need to make it stop.',
        anchors: ['Her pain makes me very uncomfortable', 'I can hold space'],
      },
      {
        text: 'She would describe me as someone who truly hears her \u2014 not just her words, but her feelings.',
        anchors: ["She'd say I don't listen", "She'd say I really hear her"],
      },
    ],
    profiles: {
      strength: {
        name: 'The Witness',
        text: "You've learned the hardest masculine skill: holding without fixing. You can sit in her pain and let it exist without your need to resolve it taking over. She feels heard \u2014 actually heard \u2014 and that is more valuable than any solution you could offer.",
      },
      emerging: {
        name: 'Recovering Fixer',
        text: "You catch yourself mid-solution now. Sometimes you still lead with 'have you tried...' but you're building the pause. The fact that you're aware of the pattern means you're already ahead of most men who've never questioned whether fixing is helping.",
      },
      default: {
        name: 'Solution Machine',
        text: "You hear 'problem' and your system activates: identify, analyze, solve. This isn't broken \u2014 it's how you were trained to show love. But she doesn't always need an engineer. Sometimes she needs a witness. Your discomfort with her unresolved emotion is driving the fixing, not her need for answers.",
      },
      blind: {
        name: 'Emotional Bypass',
        text: "Listening has been replaced entirely by advising, dismissing, or redirecting. She's stopped sharing because sharing produces lectures, not connection. The information channel is closing because the receiving end converts everything into action items.",
      },
    },
    habit_stacks: [
      {
        trigger: 'She starts venting about her day',
        action: "Before you speak, take one full breath. Then ask: 'Do you want me to help figure this out, or do you just need me to hear you right now?'",
      },
      {
        trigger: 'You feel the urge to solve',
        action: "Put your hands on your knees. This is your physical anchor for 'I'm in listening mode.' Hands on knees = ears open, mouth closed.",
      },
      {
        trigger: 'After she finishes sharing',
        action: "Reflect back one feeling, not one fact: 'That sounds really frustrating' or 'It sounds like you felt unseen.' Then stop.",
      },
    ],
    partner_practice: {
      title: 'The 5-Minute Download (Daily)',
      instruction: "Each person gets 5 minutes of uninterrupted talking. The listener's ONLY job is to say 'tell me more' or 'what was that like for you?' NO solutions. NO 'have you tried.' Set a timer. When it goes off, switch. This builds the listening muscle in a structured, low-stakes container.",
      frequency: "Daily \u2014 during dinner prep, after kids' bedtime, or on a walk",
    },
    mirror_question: "Does she share less with you now than she used to? If so, ask yourself: did she stop talking, or did you stop listening?",
  },
  {
    id: 'presence',
    icon: '\u{1F4F5}',
    title: 'Presence vs. Distraction',
    short: 'Presence',
    description: 'The discipline of being where you are \u2014 fully.',
    questions: [
      {
        text: 'When I\'m home with my partner, my phone is put away and my attention is undivided during meaningful moments.',
        anchors: ['Phone is always in hand', 'I create phone-free zones'],
      },
      {
        text: 'When she speaks to me, I give her my full attention \u2014 eye contact, body turned toward her, no multitasking.',
        anchors: ['I half-listen constantly', 'I stop and face her'],
      },
      {
        text: 'I have intentional screen-free time built into my daily routine at home.',
        anchors: ['No boundaries at all', 'Clear boundaries in place'],
      },
    ],
    profiles: {
      strength: {
        name: 'The Anchor',
        text: "When you're there, you're there. She doesn't compete with a screen for your attention. Your presence is felt \u2014 not just your proximity. In an attention economy designed to steal exactly this, you've built walls around what matters.",
      },
      emerging: {
        name: 'Building Boundaries',
        text: "You've started noticing the pull. Some zones are phone-free. Some moments get your full attention. The consistency isn't there yet, but the awareness that distraction is a choice \u2014 not a condition \u2014 has landed.",
      },
      default: {
        name: 'Present But Absent',
        text: "You're in the room but not in the moment. The screen is a coping mechanism, a stress valve, a default state \u2014 not a conscious choice. She's learned to expect the lag between her words and your attention. The distance isn't miles. It's pixels.",
      },
      blind: {
        name: 'Digital Ghost',
        text: "Your body lives in the house. Your attention lives in the device. She's stopped competing for it because the device always wins. This isn't weakness \u2014 it's the result of the most sophisticated attention engineering in human history targeting your exact brain. But understanding the trap doesn't mean staying in it.",
      },
    },
    habit_stacks: [
      {
        trigger: 'Walking through the front door',
        action: 'Phone goes in a drawer, a basket, or your bag for the first 30 minutes. The first face she sees is yours, not the back of a screen.',
      },
      {
        trigger: 'Sitting down for any meal together',
        action: "Phone face-down or in another room. If you can't do a full meal, start with the first 10 minutes.",
      },
      {
        trigger: 'She starts talking to you',
        action: 'Stop. Turn your body toward her. Make eye contact. Put down whatever is in your hands. Then respond. The 3-second pause to reorient is the whole move.',
      },
    ],
    partner_practice: {
      title: 'The Device Swap (Experiment)',
      instruction: "For one weekend, swap phones for 2 hours (or just put both in a drawer). Notice what happens to the quality of conversation, the pacing, the silence. Debrief afterward: 'What was that like? What did you notice?' This isn't about shaming screen time \u2014 it's about making the invisible visible.",
      frequency: 'One experiment, then build toward daily phone-free windows',
    },
    mirror_question: 'If she were describing the last time you gave her your full, undivided attention \u2014 how far back would she have to go?',
  },
  {
    id: 'purpose',
    icon: '\u{1F3AF}',
    title: 'Purposeful Direction',
    short: 'Purpose',
    description: 'A man with a trajectory \u2014 building something beyond the routine.',
    questions: [
      {
        text: 'I have a clear sense of personal direction \u2014 goals, projects, or ambitions I\'m actively pursuing outside of work.',
        anchors: ["I'm just getting through days", 'I have clear direction'],
      },
      {
        text: "I could articulate to my partner what I'm building toward and why it matters to me.",
        anchors: ['I have nothing to share', 'I could explain it clearly'],
      },
      {
        text: 'I regularly do something that challenges me, scares me slightly, or pushes my growth edge.',
        anchors: ['I stay in comfort zone', 'I seek growth regularly'],
      },
    ],
    profiles: {
      strength: {
        name: 'The Builder',
        text: "You have a pulse beyond the paycheck. Something you're building, becoming, or chasing that is yours. She sees a man in motion \u2014 not arriving, but traveling with intention. This is magnetic not because of the destination, but because of the aliveness.",
      },
      emerging: {
        name: 'Reigniting',
        text: "The pilot light is on. You feel the pull toward something more but haven't fully committed. The gap between 'I should' and 'I am' is where you live right now. The next step isn't a plan \u2014 it's a commitment.",
      },
      default: {
        name: 'Routine Runner',
        text: "Work, home, screen, sleep, repeat. The trajectory has flattened into a treadmill. This isn't apathy \u2014 it's often the result of systems that extracted your ambition and returned just enough comfort to keep you compliant. Purpose didn't die. It got buried under obligations.",
      },
      blind: {
        name: 'Stalled Engine',
        text: "You've stopped asking 'what's next?' The question itself feels exhausting or pointless. She sees a man who has given up on himself \u2014 not because he's weak, but because the available purposes feel hollow and no one taught him to build his own.",
      },
    },
    habit_stacks: [
      {
        trigger: 'Sunday evening planning for the week',
        action: "Write one sentence: 'This week, I'm moving toward ___.'' It can be small. A book chapter. A workout. A hard conversation. Movement is the point.",
      },
      {
        trigger: 'Commute or drive time',
        action: "Replace music/podcasts with 10 minutes of silence and one question: 'What am I building that's mine?' Let the discomfort of not knowing be the engine.",
      },
      {
        trigger: 'Monthly first Saturday',
        action: "Block 2 hours for a 'purpose audit.' What lit you up this month? What drained you? What do you want more of? Share the results with her over dinner.",
      },
    ],
    partner_practice: {
      title: 'The Dream Dinner (Monthly)',
      instruction: "Once a month, go to dinner (or cook together) with one rule: you can only talk about the future. Not logistics. Not kids' schedules. Dreams. What do you want the next 5 years to look like? What's one thing you'd do if money weren't a factor? What's one thing you've given up that you want back? Take turns. No reality-checking allowed during dinner.",
      frequency: 'Monthly \u2014 put it in the calendar like a meeting',
    },
    mirror_question: "If your 18-year-old self could see your daily routine, would he recognize a man who's still building \u2014 or a man who stopped?",
  },
  {
    id: 'frame',
    icon: '\u{1F3DB}\uFE0F',
    title: 'Frame & Presence in Public',
    short: 'Frame',
    description: 'The quiet confidence of a man who knows who he is \u2014 in any room.',
    questions: [
      {
        text: 'In social situations, I share my genuine opinions even when they might be unpopular or create mild tension.',
        anchors: ['I default to agreeing', 'I speak my mind respectfully'],
      },
      {
        text: 'I make decisions confidently in public (choosing restaurants, navigating, handling situations) without excessive deferring.',
        anchors: ['I avoid deciding anything', 'I lead when appropriate'],
      },
      {
        text: 'My partner would say I carry myself with quiet confidence in social settings \u2014 not dominating, but not disappearing.',
        anchors: ["She'd say I shrink", "She'd say I hold my own"],
      },
    ],
    profiles: {
      strength: {
        name: 'Grounded Presence',
        text: "You occupy space without performing it. You disagree without cruelty. You defer to expertise without losing yourself. She sees a man who knows who he is in any room \u2014 and that knowledge translates directly to safety. If he won't vanish in public, he won't vanish on her.",
      },
      emerging: {
        name: 'Finding the Floor',
        text: "You're learning the difference between aggression and assertion. Sometimes you still default to accommodation, but you're catching it faster. The muscle is building \u2014 you just need more reps in low-stakes environments.",
      },
      default: {
        name: 'The Accommodator',
        text: "You've made yourself small to avoid friction. Agreeableness has become your brand. But she didn't fall in love with a man who agrees with everyone \u2014 she fell in love with a man who had something to say. You were taught that stepping back was virtue. Sometimes it is. When it's always, it's erosion.",
      },
      blind: {
        name: 'The Invisible Man',
        text: "You've disappeared in rooms. She watches other men occupy space while you shrink to accommodate. This isn't cowardice \u2014 you may have been explicitly taught that assertion is toxic. But there's a canyon between domination and presence, and you've fallen into it by trying to avoid the wrong side.",
      },
    },
    habit_stacks: [
      {
        trigger: "Someone asks 'where should we eat?' or 'what should we do?'",
        action: "Answer within 5 seconds with a real suggestion. Not 'I don't care' or 'whatever you want.' A choice. She doesn't need the perfect choice \u2014 she needs to see you make one.",
      },
      {
        trigger: "You're in a conversation and disagree",
        action: "Say 'I see it differently' once this week. Then share your view. No aggression. No apology. Just your actual thought.",
      },
      {
        trigger: 'Walking into any social gathering',
        action: "Before entering, set one intention: 'I will share one genuine opinion tonight without qualifying it.' Then do it.",
      },
    ],
    partner_practice: {
      title: 'The Decision Fast (One Weekend)',
      instruction: "For one full weekend, he makes every shared decision. Where to eat. What to do. What time to leave. She can veto for safety or hard boundaries, but the default is: he decides. Debrief Sunday night: How did it feel for each of you? Where was it freeing? Where was it uncomfortable? This surfaces the power dynamics you've both been navigating unconsciously.",
      frequency: "One experiment weekend, then monthly 'your weekend' swaps",
    },
    mirror_question: 'In the last social situation you were in together \u2014 did she see someone she\'d choose again?',
  },
  {
    id: 'grievances',
    icon: '\u{1F525}',
    title: 'Addressing Small Grievances',
    short: 'Grievances',
    description: 'The courage to name the small things before they become the big thing.',
    questions: [
      {
        text: 'When something small bothers me in the relationship, I bring it up within 24-48 hours rather than burying it.',
        anchors: ['I never bring things up', 'I address them promptly'],
      },
      {
        text: 'I express my own needs and boundaries clearly, rather than silently building resentment.',
        anchors: ['I suppress until I explode', 'I communicate steadily'],
      },
      {
        text: "My partner would say she knows where she stands with me \u2014 that I don't hide what I'm feeling.",
        anchors: ["She'd say I'm a mystery/wall", "She'd say I'm transparent"],
      },
    ],
    profiles: {
      strength: {
        name: 'The Truth-Teller',
        text: "You treat small fires like small fires \u2014 easier to put out now than after they've spread. She knows where she stands because you tell her. Not cruelly. Not constantly. But honestly. The relationship runs on clean fuel because you don't let contamination build.",
      },
      emerging: {
        name: 'Breaking the Seal',
        text: "You've started saying the things you used to swallow. It's uncomfortable. It feels risky. But you're discovering that the temporary discomfort of honesty is far cheaper than the compounding cost of silence. Keep going.",
      },
      default: {
        name: 'The Peace Performer',
        text: "You call it 'keeping the peace.' What you're actually doing is building a reservoir of quiet resentment that leaks out as passive aggression, coldness, or emotional distance. She feels the distance but can't address it because you never name it. The peace is a performance. Underneath it, the pressure builds.",
      },
      blind: {
        name: 'The Silent Reservoir',
        text: "Years of unspoken irritations have calcified into a wall she can feel but can't see through. You've convinced yourself that your silence is generosity. It's self-protection dressed as maturity. The reservoir is full. It's leaking everywhere. And she's living in the flood without knowing the source.",
      },
    },
    habit_stacks: [
      {
        trigger: 'Something bothers you (a comment, a pattern, a moment)',
        action: "Within 24 hours, say: 'Hey, that thing earlier \u2014 it landed wrong for me. Can we talk about it?' Not as accusation. As offering.",
      },
      {
        trigger: 'You notice yourself withdrawing or going cold',
        action: "Stop and ask yourself: 'What am I not saying right now?' Then say it. Within the hour. Start with: 'I'm realizing I'm bothered by something and I want to name it before it grows.'",
      },
      {
        trigger: 'Weekly Sunday check-in',
        action: "End with: 'Is there anything I did this week that landed wrong for you? I'd rather hear it small than feel it big.' Give her the same invitation you're learning to use.",
      },
    ],
    partner_practice: {
      title: 'The 24-Hour Rule (Ongoing)',
      instruction: "Both partners agree: if something bothers you, you have 24 hours to name it. After 24 hours, you lose the right to bring it up as a grievance (you can still share it as information, but not as ammunition). This creates urgency for honesty and prevents stockpiling. Start each naming with 'I noticed...' not 'You always...'",
      frequency: 'Ongoing practice \u2014 becomes relationship culture over 60-90 days',
    },
    mirror_question: 'How many things are you carrying right now that she doesn\'t know about \u2014 and what is that weight doing to the space between you?',
  },
];

// ============================================================================
// ARCHETYPES
// ============================================================================

const ARCHETYPES = [
  {
    id: 'conscious_architect',
    name: 'The Conscious Architect',
    description: "You're operating with rare intentionality across most dimensions. The work now is maintenance, depth, and helping others. Your partnership has architecture \u2014 not just history.",
    condition: (cats) => cats.strength >= 6,
  },
  {
    id: 'awakening_builder',
    name: 'The Awakening Builder',
    description: "Strong foundation with clear growth edges. You're conscious in many areas and building awareness in others. The gap between your strengths and your defaults is where the most transformative work lives.",
    condition: (cats) => cats.strength >= 4 && cats.strength <= 5,
  },
  {
    id: 'emerging_man',
    name: 'The Emerging Man',
    description: "You're in the messy middle of transformation. Some areas are clicking. Others are still running on autopilot. This is exactly where growth happens \u2014 in the tension between who you've been and who you're choosing to become.",
    condition: (cats) => cats.strength >= 1 && (cats.strength + cats.emerging) >= 5,
  },
  {
    id: 'turning_point',
    name: 'The Turning Point',
    description: "You're at a crossroads. Enough awareness to see the patterns, enough defaults to feel the pull of the familiar. Every conscious choice you make from here either builds the marriage you want or reinforces the one you've settled for.",
    condition: (cats) => true, // fallback before unconscious default
  },
  {
    id: 'unconscious_default',
    name: 'The Unconscious Default',
    description: "Most of your relationship behaviors are running on programming you didn't write. This isn't failure \u2014 it's the starting line. The fact that you took this assessment means the autopilot is already cracking. What happens next is choice.",
    condition: (cats) => (cats.default + cats.blind) >= 6,
  },
];

// ============================================================================
// SCORING LOGIC
// ============================================================================

function getCategory(score) {
  if (score >= 13) return 'strength';
  if (score >= 10) return 'emerging';
  if (score >= 6) return 'default';
  return 'blind';
}

function getCategoryColor(cat) {
  return CATEGORY_META[cat]?.color || COLORS.muted;
}

function getArchetype(categoryCounts) {
  if (categoryCounts.strength >= 6) return ARCHETYPES[0];
  if ((categoryCounts.default + categoryCounts.blind) >= 6) return ARCHETYPES[4];
  if (categoryCounts.strength >= 4) return ARCHETYPES[1];
  if (categoryCounts.strength >= 1 && (categoryCounts.strength + categoryCounts.emerging) >= 5) return ARCHETYPES[2];
  return ARCHETYPES[3];
}

// ============================================================================
// HELPER: localStorage
// ============================================================================

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveState(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ============================================================================
// REUSABLE STYLE OBJECTS
// ============================================================================

const S = {
  page: {
    minHeight: '100vh',
    background: COLORS.navy,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 16,
    lineHeight: 1.7,
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 24px',
  },
  goldLine: {
    height: 3,
    background: COLORS.gold,
    border: 'none',
    margin: '32px 0',
  },
  card: {
    background: COLORS.card,
    borderRadius: 12,
    padding: 28,
    marginBottom: 20,
  },
  cardGold: {
    background: COLORS.card,
    borderRadius: 12,
    padding: 28,
    marginBottom: 20,
    borderLeft: `3px solid ${COLORS.gold}`,
  },
  heading: {
    fontFamily: FONTS.display,
    fontWeight: 700,
    color: COLORS.text,
    margin: '0 0 8px 0',
  },
  subheading: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontSize: 13,
    color: COLORS.secondary,
    margin: '0 0 16px 0',
  },
  label: {
    fontFamily: FONTS.label,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 11,
    color: COLORS.secondary,
  },
  button: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontSize: 14,
    padding: '16px 40px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: COLORS.gold,
    color: COLORS.navy,
  },
  buttonGhost: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontSize: 13,
    padding: '12px 28px',
    border: `1px solid ${COLORS.gold}`,
    borderRadius: 8,
    cursor: 'pointer',
    background: 'transparent',
    color: COLORS.gold,
    transition: 'all 0.3s ease',
  },
  navLink: {
    fontFamily: FONTS.label,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    color: COLORS.secondary,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 14px',
    transition: 'color 0.2s',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ConsciousHusbandAssessment() {
  // --- STATE ---
  const [view, setView] = useState('landing');
  const [answers, setAnswers] = useState(() => loadState('cha-answers', {}));
  const [currentBehavior, setCurrentBehavior] = useState(0);
  const [deepDiveId, setDeepDiveId] = useState(null);
  const [partnerAnswers, setPartnerAnswers] = useState(() => loadState('cha-partner-answers', {}));
  const [history, setHistory] = useState(() => loadState('cha-history', []));
  const [dailyLog, setDailyLog] = useState(() => loadState('cha-daily', {}));
  const [menuOpen, setMenuOpen] = useState(false);

  // --- PERSIST ---
  useEffect(() => saveState('cha-answers', answers), [answers]);
  useEffect(() => saveState('cha-partner-answers', partnerAnswers), [partnerAnswers]);
  useEffect(() => saveState('cha-history', history), [history]);
  useEffect(() => saveState('cha-daily', dailyLog), [dailyLog]);

  // --- COMPUTED ---
  const getScore = (behaviorId, source = answers) => {
    const b = BEHAVIORS.find(b => b.id === behaviorId);
    if (!b) return 0;
    let total = 0;
    b.questions.forEach((_, qi) => {
      total += (source[`${behaviorId}_${qi}`] || 0);
    });
    return total;
  };

  const allAnswered = BEHAVIORS.every(b =>
    b.questions.every((_, qi) => answers[`${b.id}_${qi}`] !== undefined)
  );

  const behaviorAnswered = (idx) => {
    const b = BEHAVIORS[idx];
    return b.questions.every((_, qi) => answers[`${b.id}_${qi}`] !== undefined);
  };

  const totalScore = BEHAVIORS.reduce((sum, b) => sum + getScore(b.id), 0);

  const categoryCounts = { strength: 0, emerging: 0, default: 0, blind: 0 };
  BEHAVIORS.forEach(b => {
    categoryCounts[getCategory(getScore(b.id))]++;
  });

  const archetype = getArchetype(categoryCounts);

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / 24) * 100);

  // --- NAVIGATION ---
  const navigate = useCallback((v, extra) => {
    setView(v);
    if (extra?.deepDiveId) setDeepDiveId(extra.deepDiveId);
    if (extra?.behaviorIdx !== undefined) setCurrentBehavior(extra.behaviorIdx);
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, []);

  // --- ANSWER HANDLER ---
  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const setPartnerAnswer = (key, value) => {
    setPartnerAnswers(prev => ({ ...prev, [key]: value }));
  };

  // --- SAVE TO HISTORY ---
  const saveToHistory = () => {
    const entry = {
      date: new Date().toISOString(),
      scores: {},
      archetype: archetype.id,
    };
    BEHAVIORS.forEach(b => { entry.scores[b.id] = getScore(b.id); });
    setHistory(prev => [...prev, entry]);
  };

  // --- RESET ---
  const resetAssessment = () => {
    if (allAnswered) saveToHistory();
    setAnswers({});
    setCurrentBehavior(0);
    navigate('assessment');
  };

  // ============================================================================
  // FONT LOADING
  // ============================================================================
  const fontLink = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Raleway:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: ${COLORS.navy}; }
      ::selection { background: ${COLORS.gold}; color: ${COLORS.navy}; }
      button:hover { opacity: 0.88; }
      @media (max-width: 600px) {
        .hide-mobile { display: none !important; }
      }
    `}</style>
  );

  // ============================================================================
  // NAVIGATION BAR
  // ============================================================================
  const navItems = [
    { label: 'Home', view: 'landing' },
    { label: 'Assess', view: 'assessment' },
    ...(allAnswered ? [
      { label: 'Results', view: 'results' },
      { label: 'Compare', view: 'compare' },
      { label: 'Progress', view: 'progress' },
    ] : []),
    { label: 'Practice', view: 'daily' },
    { label: 'Guide', view: 'guide' },
    { label: 'About', view: 'about' },
  ];

  const NavBar = (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: `${COLORS.navy}ee`,
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${COLORS.elevated}`,
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <button onClick={() => navigate('landing')} style={{
          ...S.label, color: COLORS.gold, fontSize: 13, letterSpacing: 4,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          THE CONSCIOUS HUSBAND
        </button>
        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 4 }}>
          {navItems.map(item => (
            <button key={item.view} onClick={() => navigate(item.view)} style={{
              ...S.navLink,
              color: view === item.view ? COLORS.gold : COLORS.secondary,
            }}>
              {item.label}
            </button>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none', color: COLORS.text,
          fontSize: 24, cursor: 'pointer', padding: 8,
        }}
        className="mobile-menu-btn">
          {menuOpen ? '\u2715' : '\u2630'}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: COLORS.surface, borderTop: `1px solid ${COLORS.elevated}`,
          padding: 16, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {navItems.map(item => (
            <button key={item.view} onClick={() => navigate(item.view)} style={{
              ...S.navLink, textAlign: 'left', padding: '12px 8px',
              color: view === item.view ? COLORS.gold : COLORS.secondary,
            }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 600px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );

  // ============================================================================
  // LANDING VIEW
  // ============================================================================
  const LandingView = (
    <div style={S.container}>
      <div style={{ textAlign: 'center', padding: '80px 0 40px' }}>
        <p style={{ ...S.label, color: COLORS.gold, letterSpacing: 6, marginBottom: 24, fontSize: 12 }}>
          THE INTERIOR ARCHITECTURE OF TRANSFORMATION
        </p>
        <h1 style={{ ...S.heading, fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.1, marginBottom: 16 }}>
          The Conscious Husband
        </h1>
        <h2 style={{ ...S.heading, fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 400, fontStyle: 'italic', color: COLORS.secondary, marginBottom: 0 }}>
          Assessment
        </h2>
        <hr style={S.goldLine} />
        <p style={{ fontFamily: FONTS.display, fontSize: 22, fontStyle: 'italic', color: COLORS.text, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Choice Is the Alpha. Not the Unconscious Reactivity of the Everyday.
        </p>
      </div>

      <div style={{ ...S.card, borderLeft: `3px solid ${COLORS.gold}`, marginBottom: 40 }}>
        <p style={{ fontFamily: FONTS.body, fontSize: 17, color: COLORS.text, lineHeight: 1.8 }}>
          This is not a quiz. This is a diagnostic mirror &mdash; a Working Genius-style assessment that maps 8 silent behaviors men repeat daily that erode attraction, respect, and connection. It doesn't just score. It categorizes, names, and provides a path forward.
        </p>
      </div>

      <h3 style={{ ...S.subheading, marginBottom: 24 }}>WHAT YOU'LL RECEIVE</h3>
      <div style={{ display: 'grid', gap: 16, marginBottom: 48 }}>
        {[
          { icon: '\u{1F4CA}', text: '24 questions across 8 behavior dimensions with custom scoring' },
          { icon: '\u{1F3AF}', text: '32 named profiles \u2014 your specific pattern identified and named' },
          { icon: '\u{1F9E9}', text: 'Habit-stacking action plans attached to your existing daily routines' },
          { icon: '\u{1F91D}', text: 'Partner practices designed for real-world integration \u2014 not therapy homework' },
          { icon: '\u{1FA9E}', text: 'Mirror questions that cut to the truth' },
        ].map((item, i) => (
          <div key={i} style={{ ...S.card, display: 'flex', gap: 16, alignItems: 'flex-start', padding: 20 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
            <p style={{ color: COLORS.text, margin: 0, fontSize: 15 }}>{item.text}</p>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 48, flexWrap: 'wrap' }}>
        {[
          { num: '24', label: 'Questions' },
          { num: '8-12', label: 'Minutes' },
          { num: '100%', label: 'Honest' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 36, color: COLORS.gold }}>{stat.num}</div>
            <div style={S.label}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button onClick={() => navigate('assessment')} style={{ ...S.button, fontSize: 16, padding: '20px 56px' }}>
          BEGIN ASSESSMENT &rarr;
        </button>
      </div>
      <p style={{ textAlign: 'center', color: COLORS.muted, fontSize: 13, fontFamily: FONTS.label, marginBottom: 80 }}>
        No data stored externally. No judgment. Just mirrors.
      </p>
    </div>
  );

  // ============================================================================
  // ASSESSMENT VIEW
  // ============================================================================
  const behavior = BEHAVIORS[currentBehavior];

  const AssessmentView = (
    <div style={S.container}>
      {/* Progress bar */}
      <div style={{ padding: '24px 0 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={S.label}>Progress</span>
          <span style={{ ...S.label, color: COLORS.gold }}>{progressPct}%</span>
        </div>
        <div style={{ height: 4, background: COLORS.elevated, borderRadius: 2 }}>
          <div style={{ height: 4, background: COLORS.gold, borderRadius: 2, width: `${progressPct}%`, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Behavior dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '16px 0 32px' }}>
        {BEHAVIORS.map((b, i) => (
          <button key={b.id} onClick={() => setCurrentBehavior(i)} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: i === currentBehavior ? COLORS.gold : behaviorAnswered(i) ? COLORS.elevated : COLORS.surface,
            color: i === currentBehavior ? COLORS.navy : behaviorAnswered(i) ? COLORS.gold : COLORS.muted,
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s',
          }} title={b.short}>
            {b.icon}
          </button>
        ))}
      </div>

      {/* Behavior header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ fontSize: 48 }}>{behavior.icon}</span>
        <p style={{ ...S.label, color: COLORS.gold, marginTop: 12, marginBottom: 8 }}>
          BEHAVIOR {currentBehavior + 1} OF 8
        </p>
        <h2 style={{ ...S.heading, fontSize: 32, marginBottom: 8 }}>{behavior.title}</h2>
        <p style={{ color: COLORS.secondary, fontFamily: FONTS.body, fontStyle: 'italic', fontSize: 16 }}>
          {behavior.description}
        </p>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '24px auto' }} />
      </div>

      {/* Questions */}
      {behavior.questions.map((q, qi) => {
        const key = `${behavior.id}_${qi}`;
        const val = answers[key];
        return (
          <div key={key} style={{ ...S.card, marginBottom: 24 }}>
            <p style={{ color: COLORS.text, fontSize: 16, lineHeight: 1.7, marginBottom: 20, fontFamily: FONTS.body }}>
              {q.text}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ ...S.label, fontSize: 10, color: COLORS.muted, maxWidth: '40%' }}>{q.anchors[0]}</span>
              <span style={{ ...S.label, fontSize: 10, color: COLORS.muted, maxWidth: '40%', textAlign: 'right' }}>{q.anchors[1]}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setAnswer(key, n)} style={{
                  width: 56, height: 56, borderRadius: 12, border: `2px solid ${val === n ? COLORS.gold : COLORS.elevated}`,
                  background: val === n ? COLORS.gold : COLORS.surface,
                  color: val === n ? COLORS.navy : COLORS.text,
                  fontSize: 20, fontFamily: FONTS.heading, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 0 80px', gap: 16 }}>
        <button
          onClick={() => { if (currentBehavior > 0) setCurrentBehavior(currentBehavior - 1); window.scrollTo(0,0); }}
          disabled={currentBehavior === 0}
          style={{ ...S.buttonGhost, opacity: currentBehavior === 0 ? 0.3 : 1, flex: 1 }}
        >
          &larr; Previous
        </button>
        {currentBehavior < 7 ? (
          <button
            onClick={() => { setCurrentBehavior(currentBehavior + 1); window.scrollTo(0,0); }}
            disabled={!behaviorAnswered(currentBehavior)}
            style={{ ...S.button, opacity: behaviorAnswered(currentBehavior) ? 1 : 0.4, flex: 1 }}
          >
            Next Behavior &rarr;
          </button>
        ) : (
          <button
            onClick={() => { if (allAnswered) navigate('results'); }}
            disabled={!allAnswered}
            style={{ ...S.button, opacity: allAnswered ? 1 : 0.4, flex: 1 }}
          >
            View My Results &rarr;
          </button>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // RESULTS VIEW
  // ============================================================================
  const radarData = BEHAVIORS.map(b => ({
    behavior: b.icon + ' ' + b.short,
    score: getScore(b.id),
    fullMark: 15,
  }));

  const sortedByScore = [...BEHAVIORS].sort((a, b) => getScore(a.id) - getScore(b.id));
  const priorities = sortedByScore.slice(0, 3);

  const ResultsView = !allAnswered ? (
    <div style={{ ...S.container, textAlign: 'center', padding: '120px 24px' }}>
      <h2 style={{ ...S.heading, fontSize: 28 }}>Complete the assessment first</h2>
      <p style={{ color: COLORS.secondary, margin: '16px 0 32px' }}>Answer all 24 questions to see your results.</p>
      <button onClick={() => navigate('assessment')} style={S.button}>Go to Assessment &rarr;</button>
    </div>
  ) : (
    <div style={S.container}>
      <div style={{ padding: '48px 0 0', textAlign: 'center' }}>
        <p style={{ ...S.label, color: COLORS.gold, letterSpacing: 6, marginBottom: 16 }}>YOUR RESULTS</p>
        <h1 style={{ ...S.heading, fontSize: 42, marginBottom: 4 }}>{archetype.name}</h1>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '20px auto' }} />
        <p style={{ fontFamily: FONTS.body, color: COLORS.secondary, fontSize: 17, maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.8 }}>
          {archetype.description}
        </p>
      </div>

      {/* Radar chart */}
      <div style={{ ...S.card, padding: '32px 8px' }}>
        <h3 style={{ ...S.subheading, textAlign: 'center', marginBottom: 16 }}>BEHAVIOR MAP</h3>
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke={COLORS.elevated} />
            <PolarAngleAxis dataKey="behavior" tick={{ fill: COLORS.secondary, fontSize: 11, fontFamily: FONTS.label }} />
            <PolarRadiusAxis angle={90} domain={[0, 15]} tick={{ fill: COLORS.muted, fontSize: 10 }} axisLine={false} />
            <Radar name="Score" dataKey="score" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.2} strokeWidth={2} dot={{ fill: COLORS.gold, r: 4 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Category distribution */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>CATEGORY DISTRIBUTION</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 40 }}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <div key={key} style={{
            background: COLORS.surface, borderRadius: 10, padding: 20, textAlign: 'center',
            border: `1px solid ${meta.color}33`,
          }}>
            <div style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 36, color: meta.color }}>
              {categoryCounts[key]}
            </div>
            <div style={{ ...S.label, fontSize: 10, color: meta.color, marginTop: 4 }}>{meta.label}</div>
            <div style={{ ...S.label, fontSize: 9, color: COLORS.muted, marginTop: 2 }}>{meta.range}</div>
          </div>
        ))}
      </div>

      {/* Behavior cards */}
      <h3 style={{ ...S.subheading, marginBottom: 16 }}>ALL 8 BEHAVIORS</h3>
      {BEHAVIORS.map(b => {
        const score = getScore(b.id);
        const cat = getCategory(score);
        const catMeta = CATEGORY_META[cat];
        return (
          <button key={b.id} onClick={() => navigate('deepdive', { deepDiveId: b.id })} style={{
            ...S.card, display: 'flex', alignItems: 'center', gap: 16, width: '100%', textAlign: 'left',
            cursor: 'pointer', border: `1px solid ${COLORS.elevated}`, transition: 'border-color 0.2s',
          }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>{b.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: FONTS.heading, fontWeight: 600, color: COLORS.text, fontSize: 15 }}>{b.short}</span>
                <span style={{
                  ...S.label, fontSize: 10, padding: '3px 10px', borderRadius: 20,
                  background: `${catMeta.color}22`, color: catMeta.color,
                }}>{catMeta.label}</span>
              </div>
              {/* Score bar */}
              <div style={{ height: 6, background: COLORS.elevated, borderRadius: 3 }}>
                <div style={{
                  height: 6, borderRadius: 3, width: `${(score / 15) * 100}%`,
                  background: catMeta.color, transition: 'width 0.6s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ ...S.label, fontSize: 9, color: COLORS.muted }}>{b.profiles[cat].name}</span>
                <span style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 14, color: catMeta.color }}>
                  {score}/15
                </span>
              </div>
            </div>
          </button>
        );
      })}

      {/* Priority panel */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>START HERE &mdash; YOUR TOP 3 PRIORITIES</h3>
      {priorities.map((b, i) => {
        const score = getScore(b.id);
        const cat = getCategory(score);
        return (
          <div key={b.id} style={{ ...S.cardGold, borderLeftColor: getCategoryColor(cat) }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{b.icon}</span>
              <div>
                <span style={{ fontFamily: FONTS.heading, fontWeight: 600, color: COLORS.text, fontSize: 16 }}>
                  #{i + 1}: {b.short}
                </span>
                <span style={{ color: COLORS.muted, fontSize: 13, marginLeft: 12 }}>{score}/15</span>
              </div>
            </div>
            <div style={{ background: COLORS.surface, borderRadius: 8, padding: 16 }}>
              <p style={{ ...S.label, fontSize: 10, color: COLORS.gold, marginBottom: 8 }}>FIRST ACTION</p>
              <p style={{ color: COLORS.secondary, fontSize: 14, margin: 0 }}>
                <strong style={{ color: COLORS.text }}>Trigger:</strong> {b.habit_stacks[0].trigger}
              </p>
              <p style={{ color: COLORS.text, fontSize: 14, margin: '6px 0 0' }}>
                <strong>Action:</strong> {b.habit_stacks[0].action}
              </p>
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: '40px 0 80px', flexWrap: 'wrap' }}>
        <button onClick={resetAssessment} style={S.buttonGhost}>Retake Assessment</button>
        <button onClick={() => navigate('daily')} style={S.button}>Start Daily Practice &rarr;</button>
      </div>
    </div>
  );

  // ============================================================================
  // BEHAVIOR DEEP DIVE VIEW
  // ============================================================================
  const deepBehavior = BEHAVIORS.find(b => b.id === deepDiveId) || BEHAVIORS[0];
  const deepScore = getScore(deepBehavior.id);
  const deepCat = getCategory(deepScore);
  const deepProfile = deepBehavior.profiles[deepCat];
  const deepIdx = BEHAVIORS.findIndex(b => b.id === deepBehavior.id);

  const DeepDiveView = (
    <div style={S.container}>
      <div style={{ padding: '48px 0 0', textAlign: 'center' }}>
        <span style={{ fontSize: 56 }}>{deepBehavior.icon}</span>
        <h1 style={{ ...S.heading, fontSize: 32, marginTop: 16, marginBottom: 4 }}>{deepBehavior.title}</h1>
        <p style={{ color: COLORS.secondary, fontStyle: 'italic', fontFamily: FONTS.body, marginBottom: 8 }}>{deepBehavior.description}</p>
        <div style={{
          display: 'inline-block', ...S.label, fontSize: 11, padding: '4px 16px', borderRadius: 20,
          background: `${getCategoryColor(deepCat)}22`, color: getCategoryColor(deepCat), marginBottom: 8,
        }}>
          {CATEGORY_META[deepCat].label}
        </div>
        <div style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 42, color: getCategoryColor(deepCat), marginBottom: 8 }}>
          {deepScore}<span style={{ fontSize: 20, color: COLORS.muted }}>/15</span>
        </div>
      </div>

      {/* Score bar with thresholds */}
      <div style={{ ...S.card, marginTop: 16 }}>
        <div style={{ position: 'relative', height: 12, background: COLORS.elevated, borderRadius: 6, marginBottom: 8 }}>
          <div style={{
            height: 12, borderRadius: 6, background: getCategoryColor(deepCat),
            width: `${(deepScore / 15) * 100}%`, transition: 'width 0.6s',
          }} />
          {/* Threshold markers */}
          {[5, 9, 12].map(t => (
            <div key={t} style={{
              position: 'absolute', left: `${(t / 15) * 100}%`, top: -4, width: 1, height: 20,
              background: COLORS.muted,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['Blind Spot', 'Default', 'Emerging', 'Strength'].map((l, i) => (
            <span key={l} style={{ ...S.label, fontSize: 9, color: COLORS.muted }}>{l}</span>
          ))}
        </div>
      </div>

      <hr style={S.goldLine} />

      {/* Profile narrative */}
      <div style={{ ...S.cardGold }}>
        <p style={{ ...S.label, color: COLORS.gold, marginBottom: 8, fontSize: 11 }}>YOUR PROFILE</p>
        <h3 style={{ ...S.heading, fontSize: 24, color: getCategoryColor(deepCat), marginBottom: 12 }}>{deepProfile.name}</h3>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, lineHeight: 1.8, margin: 0 }}>
          {deepProfile.text}
        </p>
      </div>

      {/* Mirror question */}
      <div style={{
        background: COLORS.surface, borderRadius: 12, padding: 32, marginBottom: 24,
        borderLeft: `3px solid ${COLORS.gold}`,
      }}>
        <p style={{ ...S.label, color: COLORS.gold, marginBottom: 12, fontSize: 10 }}>MIRROR QUESTION</p>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 22, color: COLORS.text,
          lineHeight: 1.6, margin: 0,
        }}>
          {deepBehavior.mirror_question}
        </p>
      </div>

      {/* Habit stacks */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>HABIT-STACK ACTIONS</h3>
      {deepBehavior.habit_stacks.map((hs, i) => (
        <div key={i} style={S.card}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: `${COLORS.gold}22`,
              color: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONTS.heading, fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>{i + 1}</div>
            <div>
              <p style={{ ...S.label, color: COLORS.gold, fontSize: 10, marginBottom: 6 }}>TRIGGER</p>
              <p style={{ fontFamily: FONTS.body, color: COLORS.secondary, fontSize: 15, margin: '0 0 12px' }}>{hs.trigger}</p>
              <p style={{ ...S.label, color: COLORS.emerging, fontSize: 10, marginBottom: 6 }}>ACTION</p>
              <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 15, margin: 0, lineHeight: 1.7 }}>{hs.action}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Partner practice */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>PARTNER PRACTICE</h3>
      <div style={{ ...S.card, border: `1px solid ${COLORS.gold}33` }}>
        <h4 style={{ ...S.heading, fontSize: 20, color: COLORS.gold, marginBottom: 12 }}>{deepBehavior.partner_practice.title}</h4>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
          {deepBehavior.partner_practice.instruction}
        </p>
        <div style={{
          display: 'inline-block', ...S.label, fontSize: 10, padding: '4px 14px', borderRadius: 20,
          background: `${COLORS.gold}22`, color: COLORS.gold,
        }}>
          {deepBehavior.partner_practice.frequency}
        </div>
      </div>

      {/* Question breakdown */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>QUESTION BREAKDOWN</h3>
      {deepBehavior.questions.map((q, qi) => {
        const val = answers[`${deepBehavior.id}_${qi}`] || 0;
        return (
          <div key={qi} style={{ ...S.card, padding: 20 }}>
            <p style={{ fontFamily: FONTS.body, color: COLORS.secondary, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{q.text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 6, background: COLORS.elevated, borderRadius: 3 }}>
                <div style={{ height: 6, borderRadius: 3, width: `${(val / 5) * 100}%`, background: COLORS.gold }} />
              </div>
              <span style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 16, color: COLORS.gold, minWidth: 30, textAlign: 'right' }}>{val}/5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ ...S.label, fontSize: 9, color: COLORS.muted }}>{q.anchors[0]}</span>
              <span style={{ ...S.label, fontSize: 9, color: COLORS.muted }}>{q.anchors[1]}</span>
            </div>
          </div>
        );
      })}

      {/* Prev/Next nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '40px 0 80px', gap: 16 }}>
        <button
          onClick={() => { if (deepIdx > 0) navigate('deepdive', { deepDiveId: BEHAVIORS[deepIdx - 1].id }); }}
          disabled={deepIdx === 0}
          style={{ ...S.buttonGhost, opacity: deepIdx === 0 ? 0.3 : 1, flex: 1 }}
        >
          &larr; {deepIdx > 0 ? BEHAVIORS[deepIdx - 1].short : 'Prev'}
        </button>
        <button onClick={() => navigate('results')} style={{ ...S.buttonGhost, flex: 1 }}>Dashboard</button>
        <button
          onClick={() => { if (deepIdx < 7) navigate('deepdive', { deepDiveId: BEHAVIORS[deepIdx + 1].id }); }}
          disabled={deepIdx === 7}
          style={{ ...S.button, opacity: deepIdx === 7 ? 0.3 : 1, flex: 1 }}
        >
          {deepIdx < 7 ? BEHAVIORS[deepIdx + 1].short : 'Next'} &rarr;
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // PARTNER COMPARISON VIEW
  // ============================================================================
  const partnerAllAnswered = BEHAVIORS.every(b =>
    b.questions.every((_, qi) => partnerAnswers[`${b.id}_${qi}`] !== undefined)
  );

  const [compareMode, setCompareMode] = useState('entry'); // 'entry' | 'results'

  const compRadarData = BEHAVIORS.map(b => ({
    behavior: b.icon + ' ' + b.short,
    self: getScore(b.id),
    partner: getScore(b.id, partnerAnswers),
    fullMark: 15,
  }));

  const gaps = BEHAVIORS.map(b => ({
    ...b,
    selfScore: getScore(b.id),
    partnerScore: getScore(b.id, partnerAnswers),
    gap: Math.abs(getScore(b.id) - getScore(b.id, partnerAnswers)),
  })).sort((a, b) => b.gap - a.gap);

  const [partnerBehaviorIdx, setPartnerBehaviorIdx] = useState(0);
  const pBehavior = BEHAVIORS[partnerBehaviorIdx];

  const CompareView = (
    <div style={S.container}>
      <div style={{ padding: '48px 0 0', textAlign: 'center' }}>
        <p style={{ ...S.label, color: COLORS.gold, letterSpacing: 6, marginBottom: 16 }}>PARTNER COMPARISON</p>
        <h1 style={{ ...S.heading, fontSize: 32, marginBottom: 8 }}>See Through Her Eyes</h1>
        <p style={{ color: COLORS.secondary, fontFamily: FONTS.body, fontSize: 15, maxWidth: 560, margin: '0 auto' }}>
          She takes the same 24 questions about you. The gaps between your self-assessment and her perspective are the conversation.
        </p>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '24px auto' }} />
      </div>

      {!allAnswered ? (
        <div style={{ ...S.card, textAlign: 'center' }}>
          <p style={{ color: COLORS.secondary }}>Complete your own assessment first.</p>
          <button onClick={() => navigate('assessment')} style={{ ...S.button, marginTop: 16 }}>Take Assessment</button>
        </div>
      ) : compareMode === 'entry' ? (
        <>
          <h3 style={{ ...S.subheading, marginBottom: 16 }}>PARTNER ASSESSMENT &mdash; BEHAVIOR {partnerBehaviorIdx + 1} OF 8</h3>
          {/* Behavior dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
            {BEHAVIORS.map((b, i) => {
              const done = b.questions.every((_, qi) => partnerAnswers[`${b.id}_${qi}`] !== undefined);
              return (
                <button key={b.id} onClick={() => setPartnerBehaviorIdx(i)} style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: i === partnerBehaviorIdx ? COLORS.partnerPink : done ? COLORS.elevated : COLORS.surface,
                  color: i === partnerBehaviorIdx ? '#fff' : done ? COLORS.partnerPink : COLORS.muted,
                  fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {b.icon}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 36 }}>{pBehavior.icon}</span>
            <h3 style={{ ...S.heading, fontSize: 24, marginTop: 8 }}>{pBehavior.short}</h3>
            <p style={{ color: COLORS.secondary, fontStyle: 'italic', fontSize: 14 }}>{pBehavior.description}</p>
          </div>

          {pBehavior.questions.map((q, qi) => {
            const key = `${pBehavior.id}_${qi}`;
            const val = partnerAnswers[key];
            return (
              <div key={key} style={{ ...S.card, marginBottom: 20 }}>
                <p style={{ color: COLORS.text, fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{q.text}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...S.label, fontSize: 9, color: COLORS.muted }}>{q.anchors[0]}</span>
                  <span style={{ ...S.label, fontSize: 9, color: COLORS.muted }}>{q.anchors[1]}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setPartnerAnswer(key, n)} style={{
                      width: 48, height: 48, borderRadius: 10,
                      border: `2px solid ${val === n ? COLORS.partnerPink : COLORS.elevated}`,
                      background: val === n ? COLORS.partnerPink : COLORS.surface,
                      color: val === n ? '#fff' : COLORS.text,
                      fontSize: 18, fontFamily: FONTS.heading, fontWeight: 700, cursor: 'pointer',
                    }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0 40px' }}>
            <button
              onClick={() => { if (partnerBehaviorIdx > 0) { setPartnerBehaviorIdx(partnerBehaviorIdx - 1); window.scrollTo(0,0); } }}
              disabled={partnerBehaviorIdx === 0}
              style={{ ...S.buttonGhost, opacity: partnerBehaviorIdx === 0 ? 0.3 : 1, flex: 1, borderColor: COLORS.partnerPink, color: COLORS.partnerPink }}
            >
              &larr; Previous
            </button>
            {partnerBehaviorIdx < 7 ? (
              <button
                onClick={() => { setPartnerBehaviorIdx(partnerBehaviorIdx + 1); window.scrollTo(0,0); }}
                style={{ ...S.button, background: COLORS.partnerPink, flex: 1 }}
              >
                Next &rarr;
              </button>
            ) : (
              <button
                onClick={() => { if (partnerAllAnswered) setCompareMode('results'); window.scrollTo(0,0); }}
                disabled={!partnerAllAnswered}
                style={{ ...S.button, background: COLORS.partnerPink, flex: 1, opacity: partnerAllAnswered ? 1 : 0.4 }}
              >
                View Comparison &rarr;
              </button>
            )}
          </div>
        </>
      ) : (
        /* Comparison results */
        <>
          <div style={{ ...S.card, padding: '32px 8px' }}>
            <h3 style={{ ...S.subheading, textAlign: 'center', marginBottom: 16 }}>DUAL PERSPECTIVE MAP</h3>
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={compRadarData} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke={COLORS.elevated} />
                <PolarAngleAxis dataKey="behavior" tick={{ fill: COLORS.secondary, fontSize: 11, fontFamily: FONTS.label }} />
                <PolarRadiusAxis angle={90} domain={[0, 15]} tick={{ fill: COLORS.muted, fontSize: 10 }} axisLine={false} />
                <Radar name="His Self-Score" dataKey="self" stroke={COLORS.partnerBlue} fill={COLORS.partnerBlue} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Her Score of Him" dataKey="partner" stroke={COLORS.partnerPink} fill={COLORS.partnerPink} fillOpacity={0.15} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: FONTS.label, color: COLORS.secondary }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>GAP ANALYSIS</h3>
          {gaps.map(g => (
            <div key={g.id} style={{ ...S.card, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontFamily: FONTS.heading, fontWeight: 600, color: COLORS.text }}>
                  {g.icon} {g.short}
                </span>
                <span style={{
                  ...S.label, fontSize: 11, color: g.gap >= 4 ? COLORS.gapIndicator : g.gap >= 2 ? COLORS.emerging : COLORS.strength,
                }}>
                  {g.gap === 0 ? 'ALIGNED' : `GAP: ${g.gap}`}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ ...S.label, fontSize: 9, color: COLORS.partnerBlue }}>HIM: {g.selfScore}</span>
                    <span style={{ ...S.label, fontSize: 9, color: COLORS.partnerPink }}>HER: {g.partnerScore}</span>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: COLORS.elevated, borderRadius: 4 }}>
                    <div style={{ position: 'absolute', height: 8, borderRadius: 4, background: COLORS.partnerBlue, width: `${(g.selfScore / 15) * 100}%`, opacity: 0.6 }} />
                    <div style={{ position: 'absolute', height: 8, borderRadius: 4, background: COLORS.partnerPink, width: `${(g.partnerScore / 15) * 100}%`, opacity: 0.6 }} />
                  </div>
                </div>
              </div>
              {g.gap >= 3 && (
                <p style={{ color: COLORS.gapIndicator, fontSize: 13, fontFamily: FONTS.body, fontStyle: 'italic', marginTop: 8 }}>
                  You scored yourself {g.selfScore}/15 on {g.short}. She scored you {g.partnerScore}/15. The gap is the conversation.
                </p>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: '40px 0 80px' }}>
            <button onClick={() => setCompareMode('entry')} style={S.buttonGhost}>Edit Partner Scores</button>
            <button onClick={() => navigate('results')} style={S.button}>Back to Dashboard</button>
          </div>
        </>
      )}
    </div>
  );

  // ============================================================================
  // PROGRESS VIEW
  // ============================================================================
  const trendData = BEHAVIORS.map(b => {
    const points = history.map((h, i) => ({
      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: h.scores[b.id] || 0,
      idx: i,
    }));
    // Add current if completed
    if (allAnswered) {
      points.push({
        date: 'Current',
        score: getScore(b.id),
        idx: points.length,
      });
    }
    return { behavior: b, points };
  });

  const ProgressView = (
    <div style={S.container}>
      <div style={{ padding: '48px 0 0', textAlign: 'center' }}>
        <p style={{ ...S.label, color: COLORS.gold, letterSpacing: 6, marginBottom: 16 }}>PROGRESS</p>
        <h1 style={{ ...S.heading, fontSize: 32, marginBottom: 8 }}>Your Journey</h1>
        <p style={{ color: COLORS.secondary, fontSize: 15 }}>Track how your behaviors shift over time.</p>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '24px auto' }} />
      </div>

      {history.length === 0 && !allAnswered ? (
        <div style={{ ...S.card, textAlign: 'center' }}>
          <p style={{ color: COLORS.secondary }}>No historical data yet. Complete the assessment and retake monthly to track progress.</p>
          <button onClick={() => navigate('assessment')} style={{ ...S.button, marginTop: 16 }}>Take Assessment</button>
        </div>
      ) : (
        <>
          {/* History list */}
          <h3 style={{ ...S.subheading, marginBottom: 16 }}>ASSESSMENT HISTORY</h3>
          {history.map((h, i) => {
            const a = getArchetype(
              Object.values(h.scores).reduce((acc, s) => {
                acc[getCategory(s)]++;
                return acc;
              }, { strength: 0, emerging: 0, default: 0, blind: 0 })
            );
            const total = Object.values(h.scores).reduce((s, v) => s + v, 0);
            return (
              <div key={i} style={{ ...S.card, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: FONTS.heading, fontWeight: 600, color: COLORS.text, fontSize: 15 }}>{a.name}</div>
                    <div style={{ ...S.label, fontSize: 10, color: COLORS.muted, marginTop: 4 }}>
                      {new Date(h.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 24, color: COLORS.gold }}>{total}/120</div>
                </div>
                {/* Mini scores */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {BEHAVIORS.map(b => {
                    const s = h.scores[b.id] || 0;
                    const cat = getCategory(s);
                    // Compare with current if available
                    const current = allAnswered ? getScore(b.id) : null;
                    const arrow = current !== null ? (current > s ? '\u2191' : current < s ? '\u2193' : '\u2192') : '';
                    return (
                      <span key={b.id} style={{
                        ...S.label, fontSize: 10, padding: '2px 8px', borderRadius: 12,
                        background: `${getCategoryColor(cat)}22`, color: getCategoryColor(cat),
                      }}>
                        {b.icon} {s} {arrow}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Trend lines */}
          {(history.length > 0 || allAnswered) && (
            <>
              <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>TREND LINES</h3>
              {trendData.filter(t => t.points.length > 1).map(t => (
                <div key={t.behavior.id} style={{ ...S.card, padding: '20px 8px' }}>
                  <p style={{ fontFamily: FONTS.heading, fontWeight: 600, fontSize: 14, color: COLORS.text, marginBottom: 8, paddingLeft: 16 }}>
                    {t.behavior.icon} {t.behavior.short}
                  </p>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={t.points}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.elevated} />
                      <XAxis dataKey="date" tick={{ fill: COLORS.muted, fontSize: 10 }} />
                      <YAxis domain={[0, 15]} tick={{ fill: COLORS.muted, fontSize: 10 }} width={30} />
                      <Line type="monotone" dataKey="score" stroke={BEHAVIOR_COLORS[t.behavior.id]} strokeWidth={2} dot={{ fill: BEHAVIOR_COLORS[t.behavior.id], r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </>
          )}

          {allAnswered && (
            <div style={{ textAlign: 'center', padding: '40px 0 80px' }}>
              <button onClick={resetAssessment} style={S.button}>Retake Assessment</button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ============================================================================
  // DAILY PRACTICE VIEW
  // ============================================================================
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const todayKey = today.toISOString().split('T')[0];
  const isSunday = dayOfWeek === 0;

  // Rotate through behaviors Mon-Sat (day 1-6 → behavior index based on week)
  const weekNumber = Math.floor((today - new Date(today.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
  const behaviorRotation = (dayOfWeek - 1 + weekNumber * 6) % 8;
  const todayBehavior = isSunday ? null : BEHAVIORS[behaviorRotation >= 0 ? behaviorRotation : 0];

  // Week calendar
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return {
      key: d.toISOString().split('T')[0],
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      date: d.getDate(),
      isToday: d.toISOString().split('T')[0] === todayKey,
      isSunday: i === 6,
    };
  });

  const DailyView = (
    <div style={S.container}>
      <div style={{ padding: '48px 0 0', textAlign: 'center' }}>
        <p style={{ ...S.label, color: COLORS.gold, letterSpacing: 6, marginBottom: 16 }}>DAILY PRACTICE</p>
        <h1 style={{ ...S.heading, fontSize: 32, marginBottom: 8 }}>
          {isSunday ? 'Rest Day' : "Today's Focus"}
        </h1>
        <p style={{ color: COLORS.secondary, fontSize: 15 }}>
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '24px auto' }} />
      </div>

      {/* Weekly calendar */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 40 }}>
        {weekDays.map(d => (
          <div key={d.key} style={{
            width: 48, height: 64, borderRadius: 10, textAlign: 'center', padding: '8px 4px',
            background: d.isToday ? COLORS.gold : dailyLog[d.key] ? `${COLORS.strength}33` : COLORS.surface,
            border: d.isToday ? 'none' : `1px solid ${COLORS.elevated}`,
          }}>
            <div style={{ ...S.label, fontSize: 9, color: d.isToday ? COLORS.navy : COLORS.muted, marginBottom: 4 }}>{d.label}</div>
            <div style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 18, color: d.isToday ? COLORS.navy : COLORS.text }}>{d.date}</div>
            {dailyLog[d.key] && <div style={{ fontSize: 10, marginTop: 2 }}>{'\u2713'}</div>}
          </div>
        ))}
      </div>

      {isSunday ? (
        <div style={{ ...S.card, textAlign: 'center', padding: 48 }}>
          <span style={{ fontSize: 48 }}>{'\u{1F54A}\uFE0F'}</span>
          <h3 style={{ ...S.heading, fontSize: 24, marginTop: 16 }}>Sunday Rest</h3>
          <p style={{ color: COLORS.secondary, fontFamily: FONTS.body, fontSize: 16, marginTop: 12, lineHeight: 1.7 }}>
            No practice today. Rest is part of the architecture. Reflect on the week. Be present without a task.
          </p>
        </div>
      ) : todayBehavior && (
        <>
          <div style={{ ...S.cardGold }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 48 }}>{todayBehavior.icon}</span>
              <h3 style={{ ...S.heading, fontSize: 24, marginTop: 8 }}>{todayBehavior.short}</h3>
              <p style={{ color: COLORS.secondary, fontStyle: 'italic', fontSize: 14 }}>{todayBehavior.description}</p>
            </div>

            <div style={{ background: COLORS.surface, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <p style={{ ...S.label, color: COLORS.gold, fontSize: 10, marginBottom: 8 }}>TODAY'S ACTION</p>
              <p style={{ fontFamily: FONTS.body, color: COLORS.secondary, fontSize: 14, marginBottom: 6 }}>
                <strong style={{ color: COLORS.text }}>Trigger:</strong> {todayBehavior.habit_stacks[0].trigger}
              </p>
              <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 15, lineHeight: 1.7 }}>
                <strong>Action:</strong> {todayBehavior.habit_stacks[0].action}
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              {dailyLog[todayKey] ? (
                <div>
                  <span style={{ fontSize: 36, color: COLORS.strength }}>{'\u2713'}</span>
                  <p style={{ color: COLORS.strength, fontFamily: FONTS.heading, fontWeight: 600, marginTop: 8 }}>Completed today</p>
                  <button onClick={() => setDailyLog(prev => { const n = { ...prev }; delete n[todayKey]; return n; })}
                    style={{ ...S.buttonGhost, marginTop: 12, fontSize: 11, padding: '8px 20px' }}>
                    Undo
                  </button>
                </div>
              ) : (
                <button onClick={() => setDailyLog(prev => ({ ...prev, [todayKey]: true }))}
                  style={{ ...S.button, padding: '16px 48px' }}>
                  I Did This Today {'\u2713'}
                </button>
              )}
            </div>
          </div>

          {/* Mirror question of the day */}
          <div style={{
            background: COLORS.surface, borderRadius: 12, padding: 28,
            borderLeft: `3px solid ${COLORS.gold}`, marginBottom: 40,
          }}>
            <p style={{ ...S.label, color: COLORS.gold, fontSize: 10, marginBottom: 8 }}>REFLECTION</p>
            <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 20, color: COLORS.text, lineHeight: 1.6, margin: 0 }}>
              {todayBehavior.mirror_question}
            </p>
          </div>
        </>
      )}

      <div style={{ padding: '0 0 80px' }} />
    </div>
  );

  // ============================================================================
  // GUIDE VIEW
  // ============================================================================
  const [guideDeepId, setGuideDeepId] = useState(null);
  const guideBehavior = guideDeepId ? BEHAVIORS.find(b => b.id === guideDeepId) : null;

  const GuideView = guideDeepId ? (
    /* Guide deep dive for a behavior */
    <div style={S.container}>
      <button onClick={() => setGuideDeepId(null)} style={{ ...S.navLink, color: COLORS.gold, padding: '24px 0', display: 'block' }}>
        &larr; BACK TO GUIDE
      </button>
      <div style={{ textAlign: 'center', paddingBottom: 24 }}>
        <span style={{ fontSize: 56 }}>{guideBehavior.icon}</span>
        <h1 style={{ ...S.heading, fontSize: 32, marginTop: 12 }}>{guideBehavior.title}</h1>
        <p style={{ color: COLORS.secondary, fontStyle: 'italic', fontSize: 16 }}>{guideBehavior.description}</p>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '24px auto' }} />
      </div>

      {/* All 4 profiles */}
      <h3 style={{ ...S.subheading, marginBottom: 16 }}>THE FOUR PROFILES</h3>
      {['strength', 'emerging', 'default', 'blind'].map(cat => {
        const profile = guideBehavior.profiles[cat];
        const meta = CATEGORY_META[cat];
        return (
          <div key={cat} style={{ ...S.card, borderLeft: `3px solid ${meta.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ ...S.heading, fontSize: 20, color: meta.color, margin: 0 }}>{profile.name}</h4>
              <span style={{ ...S.label, fontSize: 10, color: meta.color }}>{meta.label} ({meta.range})</span>
            </div>
            <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 15, lineHeight: 1.8, margin: 0 }}>{profile.text}</p>
          </div>
        );
      })}

      {/* Questions */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>THE 3 QUESTIONS</h3>
      {guideBehavior.questions.map((q, i) => (
        <div key={i} style={S.card}>
          <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>{q.text}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ ...S.label, fontSize: 10, color: COLORS.muted }}>{q.anchors[0]}</span>
            <span style={{ ...S.label, fontSize: 10, color: COLORS.muted }}>{q.anchors[1]}</span>
          </div>
        </div>
      ))}

      {/* Habit stacks */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>HABIT-STACK ACTIONS</h3>
      {guideBehavior.habit_stacks.map((hs, i) => (
        <div key={i} style={S.card}>
          <p style={{ ...S.label, color: COLORS.gold, fontSize: 10, marginBottom: 6 }}>TRIGGER</p>
          <p style={{ color: COLORS.secondary, fontSize: 14, marginBottom: 12 }}>{hs.trigger}</p>
          <p style={{ ...S.label, color: COLORS.emerging, fontSize: 10, marginBottom: 6 }}>ACTION</p>
          <p style={{ color: COLORS.text, fontSize: 15, lineHeight: 1.7, margin: 0 }}>{hs.action}</p>
        </div>
      ))}

      {/* Partner practice */}
      <h3 style={{ ...S.subheading, marginTop: 40, marginBottom: 16 }}>PARTNER PRACTICE</h3>
      <div style={{ ...S.card, border: `1px solid ${COLORS.gold}33` }}>
        <h4 style={{ ...S.heading, fontSize: 20, color: COLORS.gold, marginBottom: 12 }}>{guideBehavior.partner_practice.title}</h4>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 15, lineHeight: 1.8, marginBottom: 12 }}>
          {guideBehavior.partner_practice.instruction}
        </p>
        <div style={{ ...S.label, fontSize: 10, color: COLORS.gold }}>{guideBehavior.partner_practice.frequency}</div>
      </div>

      {/* Mirror question */}
      <div style={{
        background: COLORS.surface, borderRadius: 12, padding: 32, margin: '40px 0 80px',
        borderLeft: `3px solid ${COLORS.gold}`,
      }}>
        <p style={{ ...S.label, color: COLORS.gold, fontSize: 10, marginBottom: 12 }}>MIRROR QUESTION</p>
        <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 22, color: COLORS.text, lineHeight: 1.6, margin: 0 }}>
          {guideBehavior.mirror_question}
        </p>
      </div>
    </div>
  ) : (
    /* Guide overview */
    <div style={S.container}>
      <div style={{ padding: '48px 0 0', textAlign: 'center' }}>
        <p style={{ ...S.label, color: COLORS.gold, letterSpacing: 6, marginBottom: 16 }}>THE GUIDE</p>
        <h1 style={{ ...S.heading, fontSize: 32, marginBottom: 8 }}>The 8 Behaviors</h1>
        <p style={{ color: COLORS.secondary, fontSize: 15, maxWidth: 560, margin: '0 auto' }}>
          Eight silent behaviors men repeat daily that erode attraction, respect, and connection. Each one is a mirror &mdash; and a doorway.
        </p>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '24px auto' }} />
      </div>

      {BEHAVIORS.map(b => (
        <button key={b.id} onClick={() => setGuideDeepId(b.id)} style={{
          ...S.card, display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%', textAlign: 'left',
          cursor: 'pointer', border: `1px solid ${COLORS.elevated}`,
        }}>
          <span style={{ fontSize: 36, flexShrink: 0 }}>{b.icon}</span>
          <div>
            <h3 style={{ fontFamily: FONTS.heading, fontWeight: 600, color: COLORS.text, fontSize: 17, marginBottom: 4 }}>{b.title}</h3>
            <p style={{ color: COLORS.secondary, fontSize: 14, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>{b.description}</p>
          </div>
        </button>
      ))}

      <div style={{ padding: '0 0 80px' }} />
    </div>
  );

  // ============================================================================
  // ABOUT VIEW
  // ============================================================================
  const AboutView = (
    <div style={S.container}>
      <div style={{ padding: '48px 0 0', textAlign: 'center' }}>
        <p style={{ ...S.label, color: COLORS.gold, letterSpacing: 6, marginBottom: 16 }}>ABOUT</p>
        <h1 style={{ ...S.heading, fontSize: 32, marginBottom: 8 }}>The Origin Story</h1>
        <hr style={{ ...S.goldLine, maxWidth: 80, margin: '24px auto' }} />
      </div>

      <div style={{ ...S.cardGold }}>
        <h3 style={{ ...S.heading, fontSize: 22, marginBottom: 16 }}>How This Assessment Came to Be</h3>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
          It started with a viral thread. Helen Casanova posted a list of behaviors women observe in their husbands &mdash; things that silently erode attraction. It hit 3.4 million views. The comments were a war zone: men defensive, women validated, everyone talking past each other.
        </p>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
          The problem wasn't the content. The content was largely accurate. The problem was the frame: accusatory, gendered, and designed to produce shame rather than change. What if you could take the same observations and run them through a both/and analysis? What if, instead of blame, you offered a diagnostic mirror?
        </p>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, lineHeight: 1.8 }}>
          That's what this assessment is. It takes 8 behaviors that research and real-world observation confirm matter &mdash; and instead of shaming men for where they fall short, it categorizes, names, and provides a path forward. Because choice is the alpha. Not the unconscious reactivity of the everyday.
        </p>
      </div>

      <div style={S.card}>
        <h3 style={{ ...S.subheading, marginBottom: 16 }}>METHODOLOGY</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          {[
            { label: 'Dimensions', value: '8 behavior categories mapped from relationship research and clinical observation' },
            { label: 'Scoring', value: '4-tier system: Conscious Strength (13-15), Emerging Awareness (10-12), Unconscious Default (6-9), Active Blind Spot (3-5)' },
            { label: 'Profiles', value: '32 named profiles &mdash; 4 tiers across 8 behaviors &mdash; each with narrative, not just a number' },
            { label: 'Action System', value: 'Habit-stacking methodology &mdash; new behaviors attached to existing daily routines for maximum adoption' },
            { label: 'Partner Integration', value: 'Practices designed for real-world couples, not therapy homework. Built on reciprocity, not prescription.' },
            { label: 'Archetypes', value: '5 overall profiles based on category distribution, not raw totals &mdash; pattern recognition over point counting' },
          ].map((item, i) => (
            <div key={i} style={{ borderLeft: `2px solid ${COLORS.gold}33`, paddingLeft: 16 }}>
              <p style={{ ...S.label, color: COLORS.gold, fontSize: 10, marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.card, border: `1px solid ${COLORS.gold}33` }}>
        <h3 style={{ ...S.subheading, marginBottom: 16 }}>THE AUTHOR</h3>
        <h2 style={{ ...S.heading, fontSize: 26, marginBottom: 4 }}>Joshua Fraser, Ed.D.</h2>
        <p style={{ color: COLORS.gold, fontFamily: FONTS.label, fontWeight: 500, fontSize: 13, marginBottom: 16 }}>
          Director of Educational Equity, Brooklyn Center Community Schools
        </p>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
          Creator of the Interior Architecture of Transformation book series and assessment suite. Joshua builds diagnostic tools that map the invisible structures &mdash; the beliefs, habits, and unconscious patterns &mdash; that drive human behavior in relationships, leadership, and organizational systems.
        </p>
        <p style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, lineHeight: 1.8 }}>
          The Conscious Husband Assessment is part of the Interior Architecture ecosystem: a collection of instruments designed to make the unconscious conscious, the invisible visible, and the default intentional.
        </p>
      </div>

      <div style={{
        background: COLORS.surface, borderRadius: 12, padding: 32, margin: '24px 0 80px',
        borderLeft: `3px solid ${COLORS.gold}`, textAlign: 'center',
      }}>
        <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 24, color: COLORS.text, lineHeight: 1.5, margin: 0 }}>
          "Choice Is the Alpha.<br />Not the Unconscious Reactivity of the Everyday."
        </p>
      </div>
    </div>
  );

  // ============================================================================
  // VIEW ROUTER
  // ============================================================================
  const renderView = () => {
    switch (view) {
      case 'landing': return LandingView;
      case 'assessment': return AssessmentView;
      case 'results': return ResultsView;
      case 'deepdive': return DeepDiveView;
      case 'compare': return CompareView;
      case 'progress': return ProgressView;
      case 'daily': return DailyView;
      case 'guide': return GuideView;
      case 'about': return AboutView;
      default: return LandingView;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div style={S.page}>
      {fontLink}
      {NavBar}
      {renderView()}
      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${COLORS.elevated}`, padding: '32px 24px', textAlign: 'center',
        background: COLORS.navy,
      }}>
        <hr style={{ ...S.goldLine, maxWidth: 60, margin: '0 auto 20px' }} />
        <p style={{ ...S.label, fontSize: 10, color: COLORS.muted, letterSpacing: 3, marginBottom: 8 }}>
          THE INTERIOR ARCHITECTURE OF TRANSFORMATION
        </p>
        <p style={{ color: COLORS.placeholder, fontSize: 12, fontFamily: FONTS.label }}>
          &copy; {new Date().getFullYear()} Joshua Fraser, Ed.D. &middot; All rights reserved
        </p>
      </footer>
    </div>
  );
}
