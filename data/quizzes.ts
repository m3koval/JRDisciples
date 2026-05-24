export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  storyId: string;
  title: string;
  emoji: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: "quiz-creation",
    storyId: "creation",
    title: "God Makes Everything Quiz",
    emoji: "🌍",
    questions: [
      {
        id: "creation-q1",
        question: "What did God say when He wanted there to be light?",
        options: [
          "\"Please make light!\"",
          "\"Let there be light!\"",
          "\"I wish for light!\"",
          "\"Turn the lights on!\""
        ],
        correctIndex: 1,
        explanation: "God said 'Let there be light!' and light appeared instantly! God is so powerful that He just has to speak and things happen."
      },
      {
        id: "creation-q2",
        question: "How many days did God take to create everything?",
        options: ["3 days", "10 days", "6 days", "7 days"],
        correctIndex: 2,
        explanation: "God created everything in 6 days. On the 7th day He rested, showing us that rest is a gift from God."
      },
      {
        id: "creation-q3",
        question: "What did God do on the very last day of creation week (day 7)?",
        options: [
          "Made more animals",
          "Created the ocean",
          "Rested",
          "Made the stars"
        ],
        correctIndex: 2,
        explanation: "God rested on the 7th day — not because He was tired, but to show us that rest is a good and holy gift."
      },
      {
        id: "creation-q4",
        question: "Why are people extra special compared to everything else God made?",
        options: [
          "Because people are the biggest creatures",
          "Because God made people in His own image",
          "Because people were made first",
          "Because people can run the fastest"
        ],
        correctIndex: 1,
        explanation: "The Bible says God made people 'in His image.' That means we reflect something of who God is — we can think, love, and create, just like God does!"
      },
      {
        id: "creation-q5",
        question: "After God made everything, what did He say about it?",
        options: [
          "\"It is okay.\"",
          "\"It needs more work.\"",
          "\"It is very good!\"",
          "\"It is interesting.\""
        ],
        correctIndex: 2,
        explanation: "God looked at everything He made — including you — and said it was VERY GOOD. You are not an accident; you were made on purpose by a God who loves you!"
      }
    ]
  },
  {
    id: "quiz-noah",
    storyId: "noah",
    title: "Noah and the Great Flood Quiz",
    emoji: "🌈",
    questions: [
      {
        id: "noah-q1",
        question: "Why did God send the great flood?",
        options: [
          "Because He wanted to water His plants",
          "Because the earth was filled with sin and wickedness",
          "Because He was testing Noah's swimming skills",
          "Because He was bored"
        ],
        correctIndex: 1,
        explanation: "God sent the flood because people were doing terrible, wicked things. God is holy and hates sin — but He is also merciful to those who trust Him."
      },
      {
        id: "noah-q2",
        question: "What made Noah different from everyone else around him?",
        options: [
          "He was the tallest man alive",
          "He was the richest person",
          "He walked with God and was righteous",
          "He lived near the ocean"
        ],
        correctIndex: 2,
        explanation: "The Bible says Noah 'walked with God' and was righteous. Noah talked to God and tried to do what was right, even when no one around him did."
      },
      {
        id: "noah-q3",
        question: "How long did it rain during the flood?",
        options: [
          "7 days and 7 nights",
          "40 days and 40 nights",
          "100 days",
          "1 year"
        ],
        correctIndex: 1,
        explanation: "It rained for 40 days and 40 nights! But Noah and his family were safe inside the ark because God protected them."
      },
      {
        id: "noah-q4",
        question: "What did God put in the sky as a sign of His promise?",
        options: ["A star", "A cloud", "A rainbow", "The sun"],
        correctIndex: 2,
        explanation: "God put a rainbow in the sky as a sign of His covenant — His promise — to never flood the whole earth again. God always keeps His promises!"
      },
      {
        id: "noah-q5",
        question: "What does Noah's story teach us about obeying God?",
        options: [
          "Only obey God when it is easy",
          "Obey God even when other people laugh at you",
          "Do what God says only if it makes sense to you first",
          "You only need to obey God sometimes"
        ],
        correctIndex: 1,
        explanation: "Noah built the ark even when his neighbors laughed. He trusted God completely. We can do the right thing even when others think it is silly!"
      }
    ]
  },
  {
    id: "quiz-joseph",
    storyId: "joseph",
    title: "Joseph and His Brothers Quiz",
    emoji: "👑",
    questions: [
      {
        id: "joseph-q1",
        question: "Why were Joseph's brothers so jealous of him?",
        options: [
          "Joseph was taller and stronger than them",
          "Joseph had more sheep than them",
          "Their father loved Joseph very much and gave him a special coat",
          "Joseph won a race against all of them"
        ],
        correctIndex: 2,
        explanation: "Jacob loved Joseph very much and gave him a beautiful colorful coat. Joseph also had special dreams from God, and his brothers were filled with jealousy."
      },
      {
        id: "joseph-q2",
        question: "What did Joseph's brothers do to him?",
        options: [
          "They threw him in a pit and sold him to traders",
          "They sent him to live with their grandparents",
          "They gave him a better coat",
          "They made him the leader of their family"
        ],
        correctIndex: 0,
        explanation: "Joseph's brothers threw him in a pit and sold him to traders heading to Egypt. It was a terrible, sinful thing to do — but God was still at work."
      },
      {
        id: "joseph-q3",
        question: "Even when Joseph was a slave and in prison, what was still true?",
        options: [
          "Joseph had given up on God",
          "Everything was going great for Joseph",
          "God was with Joseph the whole time",
          "Joseph forgot about his family"
        ],
        correctIndex: 2,
        explanation: "Even in the darkest moments — as a slave, in prison — God was with Joseph. Joseph kept trusting God, and God never left him."
      },
      {
        id: "joseph-q4",
        question: "How did Joseph end up becoming powerful in Egypt?",
        options: [
          "He won a fighting tournament",
          "He was born into the royal family",
          "God helped him explain Pharaoh's mysterious dreams",
          "He stole Pharaoh's crown"
        ],
        correctIndex: 2,
        explanation: "God gave Joseph the ability to understand dreams. When Joseph explained Pharaoh's dreams about 7 years of plenty and 7 years of famine, Pharaoh made him second-in-command of all Egypt!"
      },
      {
        id: "joseph-q5",
        question: "When Joseph's brothers came to Egypt, what did Joseph say to them?",
        options: [
          "\"I am going to punish you forever!\"",
          "\"You meant evil against me, but God meant it for good!\"",
          "\"Get out of my country!\"",
          "\"I do not remember you.\""
        ],
        correctIndex: 1,
        explanation: "Joseph forgave his brothers and said, 'You meant evil against me, but God meant it for good.' This shows that God is sovereign — He can use even terrible things for His good purposes!"
      }
    ]
  },
  {
    id: "quiz-david-goliath",
    storyId: "david-goliath",
    title: "David and Goliath Quiz",
    emoji: "⚔️",
    questions: [
      {
        id: "dg-q1",
        question: "How tall was the giant Goliath?",
        options: [
          "About as tall as a normal person",
          "Over nine feet tall",
          "Six feet tall",
          "Twelve feet tall"
        ],
        correctIndex: 1,
        explanation: "Goliath was over nine feet tall — taller than two of your parents stacked up! No wonder the soldiers were terrified to fight him."
      },
      {
        id: "dg-q2",
        question: "What was David's job before he came to fight Goliath?",
        options: [
          "He was a soldier",
          "He was a fisherman",
          "He was a shepherd who watched over sheep",
          "He was a carpenter"
        ],
        correctIndex: 2,
        explanation: "David was a young shepherd boy. He used his sling to protect his sheep from lions and bears — and that same skill and faith in God helped him defeat Goliath!"
      },
      {
        id: "dg-q3",
        question: "What weapon did David use to defeat Goliath?",
        options: [
          "A big sword",
          "A heavy spear",
          "King Saul's armor",
          "A sling and a smooth stone"
        ],
        correctIndex: 3,
        explanation: "David used a simple sling and one smooth stone. But the real weapon was his faith in God! David knew the battle belonged to the Lord."
      },
      {
        id: "dg-q4",
        question: "What did David shout before he faced Goliath?",
        options: [
          "\"I am bigger than you think!\"",
          "\"You come with sword and spear, but I come in the name of the LORD!\"",
          "\"Watch out! Here I come!\"",
          "\"My sling is better than your sword!\""
        ],
        correctIndex: 1,
        explanation: "David shouted, 'You come against me with sword and spear, but I come against you in the name of the LORD Almighty!' David trusted God, not his own strength."
      },
      {
        id: "dg-q5",
        question: "What can we learn from David's courage?",
        options: [
          "You have to be big and strong to win",
          "The best weapons always win",
          "Trusting God gives us courage to face things that seem too big for us",
          "Giants are not actually scary"
        ],
        correctIndex: 2,
        explanation: "David was small but he trusted God completely. We can face our own 'giants' — fears, hard problems — when we remember that God is bigger than anything we face!"
      }
    ]
  },
  {
    id: "quiz-jonah",
    storyId: "jonah",
    title: "Jonah and the Big Fish Quiz",
    emoji: "🐋",
    questions: [
      {
        id: "jonah-q1",
        question: "Why did Jonah run away instead of going to Nineveh?",
        options: [
          "He did not know where Nineveh was",
          "He was too busy with other things",
          "He did not want God to show mercy to the wicked people of Nineveh",
          "He was afraid of fish"
        ],
        correctIndex: 2,
        explanation: "Jonah did not want God to forgive the people of Nineveh because they were enemies of Israel. But God's mercy is bigger than Jonah expected — and bigger than WE expect too!"
      },
      {
        id: "jonah-q2",
        question: "What happened when Jonah got on the ship running from God?",
        options: [
          "The ship sailed perfectly to safety",
          "God sent a huge storm that threatened to sink the ship",
          "Jonah fell asleep and had a dream",
          "Nothing happened at all"
        ],
        correctIndex: 1,
        explanation: "You cannot run from God! He sent a terrible storm. This showed Jonah — and us — that God is everywhere and you cannot hide from Him."
      },
      {
        id: "jonah-q3",
        question: "How long was Jonah inside the big fish?",
        options: [
          "One night",
          "One week",
          "Three days and three nights",
          "Ten days"
        ],
        correctIndex: 2,
        explanation: "Jonah was inside the fish for three days and three nights. While he was there in the dark, he finally prayed and said he was sorry to God."
      },
      {
        id: "jonah-q4",
        question: "What happened when Jonah finally went to Nineveh?",
        options: [
          "No one listened to him",
          "The people laughed at him",
          "The people believed God and turned away from their sin",
          "The city was destroyed anyway"
        ],
        correctIndex: 2,
        explanation: "The people of Nineveh believed God's message! From the greatest to the least, they repented. God saw their repentance and showed them mercy!"
      },
      {
        id: "jonah-q5",
        question: "What important lesson does Jonah's story teach us about God?",
        options: [
          "God only loves certain types of people",
          "God's mercy is only for people who already follow Him",
          "God's mercy and love reaches all kinds of people, including our enemies",
          "God gives up on people when they run away"
        ],
        correctIndex: 2,
        explanation: "God wanted to show mercy even to Nineveh — Israel's enemies. God's grace is bigger than we expect! And when God shows us mercy, He wants us to share that same mercy with others."
      }
    ]
  },
  {
    id: "quiz-birth-of-jesus",
    storyId: "birth-of-jesus",
    title: "The Birth of Jesus Quiz",
    emoji: "⭐",
    questions: [
      {
        id: "boj-q1",
        question: "Why did Jesus need to come to earth?",
        options: [
          "To show people cool miracles",
          "To be a good teacher",
          "To rescue people from sin because we all make wrong choices",
          "To become a king with a big palace"
        ],
        correctIndex: 2,
        explanation: "Ever since Adam and Eve, all people are broken by sin. Jesus came as our Savior — to rescue us from sin and bring us back to God. That is the best news ever!"
      },
      {
        id: "boj-q2",
        question: "Where was Jesus born?",
        options: [
          "In a king's palace in Jerusalem",
          "In a big city hospital",
          "In a stable in Bethlehem, among the animals",
          "In a house in Nazareth"
        ],
        correctIndex: 2,
        explanation: "Jesus, the King of all creation, was born in a humble stable in Bethlehem because there was no room elsewhere. This tells us Jesus came to serve, not to be served!"
      },
      {
        id: "boj-q3",
        question: "Who were the first people to hear the news that Jesus was born?",
        options: [
          "The Roman emperor",
          "Rich merchants in the city",
          "Famous religious leaders",
          "Ordinary shepherds watching their flocks at night"
        ],
        correctIndex: 3,
        explanation: "God chose humble shepherds to receive the great news first! An angel appeared to them in the night sky. God loves ordinary people and shares His best news with everyone!"
      },
      {
        id: "boj-q4",
        question: "What does the name 'Jesus' mean?",
        options: [
          "\"King of kings\"",
          "\"God saves\"",
          "\"Son of David\"",
          "\"Light of the world\""
        ],
        correctIndex: 1,
        explanation: "The name Jesus means 'God saves'! His very name tells us why He came — to save people from their sins. What a perfect name!"
      },
      {
        id: "boj-q5",
        question: "What did the angels sing when Jesus was born?",
        options: [
          "\"Happy birthday to you!\"",
          "\"A baby is born tonight!\"",
          "\"Glory to God in the highest, and on earth peace!\"",
          "\"The king has arrived!\""
        ],
        correctIndex: 2,
        explanation: "The angels sang 'Glory to God in the highest, and on earth peace to those on whom His favor rests!' The whole heavens celebrated because the Savior had come!"
      }
    ]
  }
];
