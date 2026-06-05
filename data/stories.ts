export interface Story {
  id: string;
  title: string;
  emoji: string;
  image?: string;
  reference: string;
  ageNote: string;
  summary: string[];
  bigTruth: string;
  discussionQuestions: string[];
}

export const stories: Story[] = [
  {
    id: "creation",
    title: "God Makes Everything",
    emoji: "🌍",
    image: "/images/jr/story-creation.png",
    reference: "Genesis 1-2",
    ageNote: "Great for ages 6-10",
    summary: [
      "In the very beginning, there was nothing — no sun, no stars, no animals, no people. Just darkness and emptiness. But God was there! And God is so powerful that He can make anything just by speaking. He said, 'Let there be light!' and BOOM — there was light! That is how amazing God is.",
      "Over six days, God made everything we see. He made the sky and the oceans. He made land and plants and trees full of fruit. He made the sun and the moon and billions of twinkling stars. He made fish in the sea, birds in the sky, and all kinds of animals on the land. Each time He made something, He looked at it and said, 'That is good!'",
      "On the sixth day, God did something very special. He made a person — a man named Adam — out of dust from the ground. Then God breathed life into Adam's nose, and Adam was alive! God placed Adam in a beautiful garden called Eden. Then God saw that Adam was lonely, so He made a woman named Eve to be Adam's helper and friend.",
      "God told Adam and Eve to take care of the garden and to enjoy all the good things He made. He gave them everything they needed. On the seventh day, God rested — not because He was tired, but to show us that rest is a gift. Everything God made was very, very good.",
      "This story teaches us that God made YOU on purpose. You are not an accident. God made you in His image, which means you reflect something of who God is. That makes you incredibly special!"
    ],
    bigTruth: "God is the all-powerful Creator who made everything — including you — on purpose and with love.",
    discussionQuestions: [
      "If God made everything, what does that tell us about who is in charge of the world?",
      "Genesis 1:27 says God made people 'in His image.' What do you think that means for how we should treat each other?",
      "God said everything He made was 'very good.' How should knowing that God made you change the way you think about yourself?"
    ]
  },
  {
    id: "noah",
    title: "Noah and the Great Flood",
    emoji: "🌈",
    image: "/images/jr/story-noah.png",
    reference: "Genesis 6-9",
    ageNote: "Great for ages 6-10",
    summary: [
      "A long time after God made the world, people started making very bad choices. They lied, they hurt each other, and they forgot all about God. The whole earth was filled with sin and sadness. God's heart was broken because He loved the people He had made.",
      "But there was one man who loved God — his name was Noah. The Bible says Noah 'walked with God,' which means Noah talked to God, listened to God, and tried to do what was right. God decided to send a great flood to wash away the wickedness, but He wanted to save Noah and his family.",
      "God told Noah to build a HUGE boat called an ark. His neighbors probably laughed at him — there was not even any rain! But Noah trusted God and did exactly what God said. He built the ark, and God brought two of every kind of animal to go inside. Then Noah, his wife, his sons, and their wives all got in, and God shut the door.",
      "It rained for forty days and forty nights. Water covered even the tallest mountains! But Noah and everyone inside the ark were safe. When the waters went down, the ark landed on a mountain. Noah sent out a dove, and it came back with an olive leaf — land was near! When they all finally walked off the ark, Noah built an altar and thanked God.",
      "God made a promise — called a covenant — to never flood the whole earth again. He put a rainbow in the sky as a sign of that promise. Every time you see a rainbow, you can remember that God keeps every single promise He makes!"
    ],
    bigTruth: "God is holy and hates sin, but He is also merciful and saves those who trust and obey Him.",
    discussionQuestions: [
      "Why did God send the flood? What does that tell us about how seriously God takes sin?",
      "Noah obeyed God even when it seemed silly to his neighbors. Can you think of a time it might be hard to obey God? How can you trust Him anyway?",
      "What does the rainbow remind us about God's character? Why is it important that God keeps His promises?"
    ]
  },
  {
    id: "joseph",
    title: "Joseph and His Brothers",
    emoji: "👑",
    image: "/images/jr/story-joseph.png",
    reference: "Genesis 37-50",
    ageNote: "Great for ages 7-10",
    summary: [
      "Joseph was one of twelve brothers, and his father Jacob loved him very much. Jacob gave Joseph a beautiful colorful coat. Joseph also had dreams from God that showed him his family would one day bow down before him. His brothers were so jealous they could hardly stand it!",
      "One day, the brothers decided to get rid of Joseph. They threw him into a pit and then sold him to traders who took him far away to Egypt. They brought his beautiful coat back to their father soaked in goat's blood. Jacob cried and cried, thinking his son was dead. Joseph was now a slave in a foreign land — far from home, far from family.",
      "But here is the amazing part: God was with Joseph every step of the way! Even as a slave, Joseph worked hard and honored God. Even when he was thrown into prison for something he did not do, he kept trusting God. God gave Joseph the ability to understand dreams, and one day Pharaoh — the king of Egypt — had mysterious dreams that no one could explain. Joseph told Pharaoh what the dreams meant: seven years of plenty, then seven years of famine. Pharaoh was so amazed he made Joseph the second most powerful man in all of Egypt!",
      "When the famine came, Joseph's brothers traveled to Egypt looking for food. They did not recognize Joseph, but he recognized them. After testing them, Joseph finally revealed who he was — and he wept with joy. His brothers were terrified he would punish them. But Joseph said something extraordinary: 'You meant evil against me, but God meant it for good.' He forgave them completely and brought the whole family to live safely in Egypt.",
      "Joseph's life had so many hard turns — betrayal, slavery, prison — but God had a plan the whole time. Not one moment was wasted. God used every hard thing to put Joseph exactly where He needed him to be. This story shows us that even when life is confusing or painful, God is still in charge and His plan is always good."
    ],
    bigTruth: "God is sovereign over every hard thing in our lives, working all things together for good according to His perfect plan.",
    discussionQuestions: [
      "Joseph went through slavery and prison before things got better. Why do you think God sometimes lets hard things happen to His people?",
      "Joseph forgave his brothers even though they had hurt him terribly. How is that possible? What helps us forgive people who have hurt us?",
      "Joseph said, 'You meant evil against me, but God meant it for good.' What does this tell us about who is really in control of our lives?"
    ]
  },
  {
    id: "david-goliath",
    title: "David and Goliath",
    emoji: "⚔️",
    image: "/images/jr/story-david.png",
    reference: "1 Samuel 17",
    ageNote: "Great for ages 6-10",
    summary: [
      "The Israelites were at war with a people called the Philistines. Every single day, a giant soldier named Goliath would come out and shout across the battlefield. He was over nine feet tall — taller than two of your parents stacked up! He wore heavy armor and carried a huge spear. His voice boomed like thunder: 'Send someone to fight me! If your man wins, we will be your slaves. But if I win, YOU will be OUR slaves!' Every Israelite soldier trembled with fear. No one dared to fight him.",
      "Then a young shepherd boy named David came to bring food to his brothers in the army. David was not a soldier — he was probably a teenager, small and thin. When he heard Goliath mocking God's people, David was not afraid. He was ANGRY. He said, 'Who is this Philistine that he should defy the armies of the living God?' David told King Saul he would fight the giant. Saul tried to dress David in armor, but it was way too big. David took it off.",
      "Instead, David went to the stream and picked up five smooth stones. He had his sling — a simple tool he used to protect his sheep from lions and bears. He walked out to face the giant. Goliath looked at this little shepherd boy and laughed. 'Am I a dog, that you come at me with sticks?' he roared. But David shouted back: 'You come against me with sword and spear, but I come against you in the name of the LORD Almighty!'",
      "David put a stone in his sling, swung it around, and — CRACK! The stone hit Goliath right in the forehead. The giant crashed to the ground like a falling tree. The Philistines ran away in terror. All of Israel cheered!",
      "David did not win because he was big or strong or had the best weapons. He won because he trusted in God. He knew that the battle belonged to the Lord. When we face things that seem way too big for us, we can remember David and trust that God is bigger than any giant."
    ],
    bigTruth: "True courage is not the absence of fear but trusting that God is bigger than whatever giant stands before you.",
    discussionQuestions: [
      "David said, 'The battle belongs to the LORD.' What does that mean for the problems and fears we face today?",
      "Everyone else was afraid of Goliath, but David was not. What was different about the way David was thinking about the situation?",
      "What are some 'giants' in your life — things that seem scary or too big? How can you be more like David when you face them?"
    ]
  },
  {
    id: "jonah",
    title: "Jonah and the Big Fish",
    emoji: "🐋",
    image: "/images/jr/story-jonah.png",
    reference: "Jonah 1-4",
    ageNote: "Great for ages 6-10",
    summary: [
      "God told a prophet named Jonah to go to a city called Nineveh and tell the people there to stop doing evil things. Nineveh was a wicked city — the people there were enemies of Israel. Jonah did not want to go. He thought those people did not deserve God's mercy. So instead of obeying, Jonah ran the other way! He got on a ship heading as far from Nineveh as he could go.",
      "But you cannot run from God. Out on the ocean, God sent a huge storm. The waves crashed so hard the ship nearly broke apart. The sailors were terrified. They prayed to their gods, threw things overboard to lighten the ship — but nothing helped. Jonah was asleep below the deck! The captain woke him up. 'How can you sleep?! Pray to your God!' The sailors drew lots to find out who caused the trouble, and the lot fell to Jonah. Jonah admitted he was running from God. He told them to throw him into the sea to make the storm stop. They did — and the storm stopped immediately.",
      "God had prepared a giant fish, and it swallowed Jonah whole. Jonah was alive inside the fish for three whole days and three nights. In the darkness and the mess, Jonah finally prayed. He said he was sorry. He praised God and promised to obey. Then God spoke to the fish, and the fish spit Jonah out onto dry land.",
      "God told Jonah a second time: 'Go to Nineveh.' This time Jonah went. He walked into the city and said, 'In forty days, Nineveh will be destroyed!' And something amazing happened — the people believed God. From the greatest to the least, they fasted and turned away from their sin. Even the king put on scratchy clothes and sat in ashes to show he was sorry. God saw their repentance and did not destroy the city.",
      "But Jonah was furious. He said, 'I KNEW you would forgive them! That is why I ran!' God gently showed Jonah that His love and mercy is for all people, not just the ones we like. Jonah needed to learn to love what God loves. This story shows us that we cannot run from God, and it also shows us that God's grace is bigger than we expect — for us AND for people we might not think deserve it."
    ],
    bigTruth: "God's mercy reaches people who don't deserve it — and that includes us — so we should joyfully share His message with everyone.",
    discussionQuestions: [
      "Jonah ran away from what God told him to do. Have you ever not wanted to do something you knew was right? What happened?",
      "Inside the fish, Jonah prayed and turned back to God. Why is it never too late to repent and come back to God?",
      "Jonah was angry that God forgave the Ninevites. Why do you think it can be hard to want God's mercy for people we don't like? What should we do with that feeling?"
    ]
  },
  {
    id: "birth-of-jesus",
    title: "The Birth of Jesus",
    emoji: "⭐",
    image: "/images/jr/story-birth-of-jesus.png",
    reference: "Luke 2",
    ageNote: "Great for ages 6-10",
    summary: [
      "Ever since Adam and Eve sinned in the garden, people have been broken inside. We all choose wrong things. We lie, we are selfish, we hurt others, and we forget about God. The Bible calls this sin, and sin separates us from God, who is perfectly holy. People needed someone to rescue them — a Savior. For hundreds of years, God's people waited and hoped for the one God had promised.",
      "Then one night in a tiny town called Bethlehem, the most important thing that ever happened in all of history took place. A young woman named Mary had been told by an angel that she would have a very special baby — the Son of God. She was engaged to a man named Joseph. They had traveled to Bethlehem for a census, but when they arrived, there was no room anywhere to stay. The only place available was a stable, a place where animals lived.",
      "And there, among the hay and the animals, Mary had her baby. She wrapped Him in cloths and laid Him in a manger — a feeding trough for animals. The King of all creation, the Son of the living God, was born in the humblest place imaginable. His name was Jesus, which means 'God saves.'",
      "That same night, nearby shepherds were watching their sheep in the fields. Suddenly the sky blazed with light and an angel appeared! The shepherds were terrified. But the angel said, 'Do not be afraid! I bring you good news of great joy for all people — today in the town of David a Savior has been born. He is Christ the Lord!' Then a huge crowd of angels filled the sky, singing, 'Glory to God in the highest, and on earth peace to those on whom His favor rests!' The shepherds ran to find the baby, and they found everything exactly as the angel had said.",
      "Jesus came not to be served but to serve, and to give His life to rescue us from sin. Christmas is not just a birthday party — it is the beginning of the greatest rescue mission ever. God Himself came to earth as a baby because He loves us so much. That tiny baby in the manger would grow up to be the Savior of the world."
    ],
    bigTruth: "Jesus is the Son of God who came into the world as a baby to be the Savior we all need — this is the best news in all of history.",
    discussionQuestions: [
      "Why did Jesus need to come to earth? What problem was He born to solve?",
      "The angel said the good news of Jesus is 'for all people.' Who does that include? How should that change the way we treat others?",
      "Jesus was the King of kings, but He was born in a stable. What does that tell us about what kind of King Jesus is?"
    ]
  },
  {
    id: "jesus-baptism",
    title: "Jesus Is Baptized",
    emoji: "🕊️",
    image: "/images/jr/stories/jesus-baptism/story-jesus-baptism.png",
    reference: "Matthew 3:13-17; Mark 1:9-11; Luke 3:21-22",
    ageNote: "Great for ages 6-10",
    summary: [
      "John the Baptist was preaching near the Jordan River. He told people to turn away from sin and get ready for God's kingdom. Many people came to the water to be baptized as a sign that they were sorry for sin and wanted to walk in God's way.",
      "Then Jesus came from Galilee to the Jordan to be baptized by John. John was surprised. Jesus had never sinned, so He did not need to be baptized because He needed forgiveness. John said that Jesus should be baptizing him!",
      "But Jesus told John that it was right to do this to fulfill all righteousness. Jesus was doing exactly what was right in God's plan. He was obeying the Father's good plan. He was standing with the people He came to save, even though He Himself was perfectly holy.",
      "When Jesus was baptized and came up from the water, the heavens opened. The Holy Spirit came down like a dove and rested on Him. Then the Father's voice spoke from heaven: 'This is my beloved Son, with whom I am well pleased.'",
      "Jesus' baptism shows us who He is: the beloved Son of God. It also helps us understand baptism. Baptism is not magic water that saves us. Jesus saves. Baptism is a public step of obedience that shows we trust Jesus, belong to Him, and want to follow Him with our whole life."
    ],
    bigTruth: "Jesus is God's beloved Son, and baptism is a public step of obedience that points to trusting and following Him.",
    discussionQuestions: [
      "Why was John surprised that Jesus wanted to be baptized?",
      "What did the Father, Son, and Holy Spirit each do at Jesus' baptism?",
      "Why is it important to remember that Jesus saves us, not the water?"
    ]
  }
];
