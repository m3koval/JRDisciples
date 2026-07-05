export interface LessonTopic {
  href: string;
  image: string;
  title: string;
  desc: string;
  color: string;
  sections: number;
  emoji: string;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  challenge: string;
}

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  sections: LessonSection[];
}

export const lessonTopics: LessonTopic[] = [
  {
    href: "/lessons/how-to-pray",
    image: "/images/jr/lessons/how-to-pray/topic-how-to-pray.png",
    title: "How to Talk to God",
    desc: "Daniel prayed even when it was dangerous. Jesus gave us a pattern. Paul said bring your worries to God. 4 sections: who God is, coming humbly, giving worries to God, and building your own prayer.",
    color: "#7c3aed",
    sections: 4,
    emoji: "🙏",
  },
  {
    href: "/lessons/mustard-seed-faith",
    image: "/images/jr/lessons/mustard-seed-faith/topic-mustard-seed-faith.png",
    title: "Mustard Seed Faith",
    desc: "Right after the Transfiguration, a desperate father runs to Jesus. The disciples couldn't help — but Jesus healed immediately. What does faith the size of a mustard seed really mean? 4 sections.",
    color: "#15803d",
    sections: 4,
    emoji: "🌱",
  },
  {
    href: "/lessons/jonah-big-fish",
    image: "/images/jr/story-jonah.png",
    title: "Jonah & the Big Fish",
    desc: "An interactive Bible story with the lesson built in: follow Jonah from running away, through the storm and fish, to Nineveh receiving mercy. Includes a story map plus 4 guided activities.",
    color: "#075985",
    sections: 4,
    emoji: "🐋",
  },
  {
    href: "/lessons/baptism-prep",
    image: "/images/jr/lessons/baptism-prep/topic-baptism-prep.png",
    title: "Why Get Baptized?",
    desc: "Learn what baptism means, why Jesus was baptized, and why followers of Jesus choose this public step of faith. 5 child-friendly sections with checks and questions!",
    color: "#0a7090",
    sections: 5,
    emoji: "💧",
  },
  {
    href: "/lessons/case-for-christ-gods-son",
    image: "/images/jr/topic-case-for-christ-gods-son.png",
    title: "Is Jesus Really God’s Son?",
    desc: "Follow the identity trail: Peter’s confession, John’s testimony, and why Son of God does not mean Jesus was created. 5 identity cards with detective checks!",
    color: "#4b2a7b",
    sections: 5,
    emoji: "👑",
  },
  {
    href: "/lessons/case-for-christ-resurrection",
    image: "/images/jr/topic-case-for-christ-resurrection.png",
    title: "Did Jesus Really Rise from the Dead?",
    desc: "Examine the witness trail: Jesus died, was buried, rose again, and appeared to real people. 5 witness cards with detective checks!",
    color: "#5b1530",
    sections: 5,
    emoji: "🌅",
  },
  {
    href: "/lessons/case-for-christ-cross",
    image: "/images/jr/topic-case-for-christ-cross.png",
    title: "Why Did Jesus Have to Die?",
    desc: "Follow the justice-and-mercy trail: sin is serious, Jesus is the willing Substitute, and the cross shows God’s holy justice and deep mercy. 6 teaching steps with a hands-on card activity!",
    color: "#4a1230",
    sections: 6,
    emoji: "✝️",
  },
  {
    href: "/lessons/case-for-christ-bible",
    image: "/images/jr/topic-case-for-christ-bible.png",
    title: "Can We Trust the Bible?",
    desc: "Follow the evidence trail: real history, eyewitness testimony, careful copying, and God’s faithful Word. 5 clue cards with detective checks!",
    color: "#1f5f8f",
    sections: 5,
    emoji: "📜",
  },
  {
    href: "/lessons/holy-spirit",
    image: "/images/jr/topic-holy-spirit.png",
    title: "The Holy Spirit",
    desc: "Who is He? His symbols, roles, fruit, gifts, and how to live with Him — 7 sections with interactive challenges!",
    color: "#0d3a6a",
    sections: 7,
    emoji: "🕊️",
  },
  {
    href: "/lessons/transfiguration",
    image: "/images/jr/topic-transfiguration.png",
    title: "The Transfiguration",
    desc: "Jesus revealed His glory on a mountain — and what that means for you. 4 sections with story sequencing, witness cards, T/F quiz, and a memory verse!",
    color: "#8a6500",
    sections: 4,
    emoji: "⛰️",
  },
  {
    href: "/lessons/who-is-jesus",
    image: "/images/jr/topic-who-is-jesus.png",
    title: "Who Is Jesus?",
    desc: "Examine the evidence — His claims, fulfilled prophecies, miracles, and resurrection. 5 sections with detective-style interactive challenges!",
    color: "#8a1a30",
    sections: 5,
    emoji: "✝️",
  },
];

export const lessons: Lesson[] = [
  {
    id: "holy-spirit",
    title: "The Holy Spirit",
    emoji: "🕊️",
    sections: [
      {
        id: "spirit-who",
        title: "Section 1: Who Is the Holy Spirit?",
        content: `The Holy Spirit is the third person of the Holy Trinity. He doesn't have a human body, but He is alive, personal, and a powerful Spirit of God!

The Holy Spirit was with God from the very beginning. In Genesis, we read that "the Spirit of God was hovering over the waters." The Holy Spirit breathed life into creation.

Jesus told His disciples about the Holy Spirit. He said, "I will send you a Helper." This Helper is the Holy Spirit! After Jesus went back to heaven, the Holy Spirit was sent on Pentecost, and ever since then, He has lived in the hearts of believers.

The Holy Spirit is a power that gives us strength, courage, and help in our lives. He comforts us when we're sad, guides us when we don't know what to do, and helps us become more like Jesus.`,
        challenge: "Write down three things you learned about the Holy Spirit. Pray and ask the Holy Spirit to help you today.",
      },
      {
        id: "spirit-symbols",
        title: "Section 2: Symbols of the Holy Spirit",
        content: `In the Bible, the Holy Spirit is often shown through symbols that help us understand who He is and what He does.

**Dove:** When Jesus was baptized, the Holy Spirit came down like a dove. A dove symbolizes purity, innocence, and the peace that the Holy Spirit brings.

**Fire:** Fire symbolizes power, cleansing, and transformation. On Pentecost, tongues of fire appeared above the believers' heads, filling them with the Holy Spirit's power.

**Water:** Water symbolizes renewal and cleansing. Jesus said, "Whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life."

**Wind:** Wind is an invisible force that moves and changes things. The same way, the Holy Spirit works in our lives — we don't see Him, but we feel His influence.

**Oil:** Oil symbolizes anointing (setting apart) and blessing. The Holy Spirit anoints us for God's service.

All these symbols show us that the Holy Spirit is powerful, pure, transforming, and helpful!`,
        challenge: "Choose one symbol of the Holy Spirit. Draw it or write what it means to you.",
      },
      {
        id: "spirit-roles",
        title: "Section 3: Roles of the Holy Spirit",
        content: `The Holy Spirit has many important roles in our lives and in the Church:

**Teacher and Guide:** The Holy Spirit helps us understand God's Word and teaches us truth. Jesus said, "The Holy Spirit will teach you all things and will remind you of everything I have said to you."

**Comforter:** When we're sad, upset, or scared, the Holy Spirit comforts us and gives us peace.

**Helper:** The Holy Spirit helps us in prayer when we don't know what to say. He intercedes for us before God.

**Director:** The Holy Spirit guides us in right decisions. He tells us which path to choose, what to do, how to act.

**Witness:** The Holy Spirit testifies that we are God's children. He confirms our faith in Jesus.

**Giver of Strength:** The Holy Spirit gives us power to confess our faith, serve others, and live as Christians.

**Transformer:** The Holy Spirit works in us, changing us from the inside out and making us more like Jesus day by day.`,
        challenge: "Which role of the Holy Spirit is most important to you right now? Pray about it.",
      },
      {
        id: "spirit-fruits",
        title: "Section 4: Fruit of the Holy Spirit",
        content: `When the Holy Spirit lives in us, He produces fruit — qualities and characteristics that become part of our lives.

In Galatians 5:22-23, the fruit of the Holy Spirit is listed:

**Love:** Caring for others even when it's hard. Love is the most important fruit.

**Joy:** Happiness and thankfulness that come from knowing God and His love for us.

**Peace:** Calm and confidence that God is with us and everything will be okay.

**Patience:** The ability to wait without getting grumpy or upset. Not getting angry quickly.

**Kindness:** The desire to help others, show them love, and serve them.

**Goodness:** Doing what is right because we love God — not just to show off.

**Faithfulness:** Being reliable and keeping our promises, like Daniel who prayed three times a day even when it was against the law!

**Gentleness:** Soft words and a humble heart. Jesus said, "I am gentle and humble in heart."

**Self-Control:** The ability to control our feelings and actions, and make the right choice.

If the Holy Spirit lives in us, these fruits should grow in our lives!`,
        challenge: "Which fruit of the Holy Spirit do you want to grow in your life? Ask the Holy Spirit to help you grow in it.",
      },
      {
        id: "spirit-gifts",
        title: "Section 5: Gifts of the Holy Spirit",
        content: `The Holy Spirit gives believers spiritual gifts — special abilities to serve God and help other people.

**Ministry Gifts (1 Corinthians 12:28-30):**

**Apostleship:** The ability to start new churches and lead people.

**Prophecy:** The ability to speak God's Word and deliver His message to people.

**Pastoring:** The ability to care for people, lead them, protect them, and teach them.

**Teaching:** The ability to explain the Bible and teach others about God's truths.

**Helping:** The ability to help others, support them, and serve their needs.

**Leadership:** The ability to manage, organize, and lead groups of people.

**Power Gifts (1 Corinthians 12:9-10):**

**Healing:** The ability to pray for sick people, and God heals them.

**Miracles:** The ability to see God do miracles through prayer.

**Revelation Gifts (1 Corinthians 12:8-10):**

**Word of Wisdom:** The ability to give wise advice that helps people.

**Word of Knowledge:** The ability to know truth that God wants to reveal.

**Discernment of Spirits:** The ability to know if someone is telling the truth or lying.

**Tongues:** The ability to pray in languages we haven't learned.

**Interpretation of Tongues:** The ability to explain what these languages mean.

Every believer has at least one gift! Gifts are given to us not to make ourselves look good, but to serve others and glorify God!`,
        challenge: "What gift of the Holy Spirit do you think you have? How can you use that gift to serve others?",
      },
      {
        id: "spirit-living",
        title: "Section 6: How to Live with the Holy Spirit",
        content: `If the Holy Spirit lives in us, how should we live to stay in harmony with Him?

**1. Listen to the Holy Spirit:**
The Holy Spirit often speaks to us through our inner feeling. When you know something is right and something is wrong, that's often the voice of the Holy Spirit. Learn to listen to Him.

**2. Obey the Holy Spirit:**
When the Holy Spirit guides you to do something or tells you not to do something, obey. Even if it's hard.

**3. Don't grieve the Holy Spirit:**
When we sin, we grieve the Holy Spirit. Try to avoid sin and ask for forgiveness when you mess up.

**4. Pray in the Spirit:**
Pray often and let the Holy Spirit help you in prayer. He will help you find the right words.

**5. Be filled with the Holy Spirit:**
Keep asking the Holy Spirit to fill you with His power, direction, and comfort.

**6. Trust the Holy Spirit:**
Believe that the Holy Spirit is with you, helping you, and protecting you.

**7. Grow in love and the fruits of the Spirit:**
Let the Holy Spirit produce fruit in you — love, joy, peace, patience, kindness, and everything else.

**8. Serve others:**
Use the gifts the Holy Spirit gave you to serve others and tell them about Jesus.`,
        challenge: "Choose one of these 8 points and focus on it for a week. Pray about it every day.",
      },
      {
        id: "spirit-assurance",
        title: "Section 7: Assurance Through the Holy Spirit",
        content: `One of the greatest roles of the Holy Spirit is to give us assurance that we are saved and that God loves us!

**The Holy Spirit witnesses to our salvation:**
In Romans 8:16 it says, "The Spirit himself testifies with our spirit that we are God's children."

This means the Holy Spirit speaks to our heart saying: "Yes, you are saved. You belong to God. You are His child!"

**The Holy Spirit is a guarantee of our inheritance:**
In Ephesians 1:13-14, it says that the Holy Spirit is a deposit guaranteeing our inheritance — a promise that we will receive eternal life.

**The Holy Spirit comforts us:**
When we're afraid, when we're sad, when we're lonely, the Holy Spirit says to us: "I'm with you. God loves you. Everything will be okay."

**No one can take the Holy Spirit away from us:**
If we believe in Jesus and receive the Holy Spirit, He lives in us forever. Even if we mess up, the Holy Spirit doesn't leave us.

**Our relationship with the Holy Spirit is our relationship with God:**
When we follow the Holy Spirit and trust Him, we develop a close relationship with God. We learn His love, mercy, and guidance in our lives.

**Conclusion:**
The Holy Spirit is God's greatest gift to us. He lives in us, teaches us, guides us, comforts us, and gives us power to live as God's children. If you haven't invited Jesus into your heart yet, you can do it right now. Just say: "Jesus, I believe in you. Forgive my sins. Live in my heart. Help me follow you all my life." And the Holy Spirit will come to live in you!`,
        challenge: "Write a prayer thanking the Holy Spirit for all He does for you. Share this prayer with someone you love.",
      },
    ],
  },
];
