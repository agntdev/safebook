export interface Tip {
  id: number;
  content: string;
  category: TipCategory;
  explanation: string;
  nextSteps: string;
}

export type TipCategory = "account" | "phishing" | "passwords" | "privacy" | "devices";

export const TIP_CATEGORIES: Record<TipCategory, { label: string; emoji: string }> = {
  account: { label: "Account Security", emoji: "🔒" },
  phishing: { label: "Phishing Scams", emoji: "🎣" },
  passwords: { label: "Passwords", emoji: "🔑" },
  privacy: { label: "Privacy", emoji: "👁️" },
  devices: { label: "Device Safety", emoji: "📱" },
};

export const TIPS: Tip[] = [
  {
    id: 1,
    content: "Enable two-factor authentication on your Facebook account for an extra layer of security.",
    category: "account",
    explanation: "Two-factor authentication (2FA) requires a code from your phone in addition to your password. Even if someone steals your password, they can't get in without your phone.",
    nextSteps: "Go to Settings → Security and Login → Two-Factor Authentication to turn it on.",
  },
  {
    id: 2,
    content: "Never click on links in messages from strangers — they may be phishing attempts.",
    category: "phishing",
    explanation: "Phishing links look like real Facebook pages but steal your login info. Always check the URL carefully before entering your password.",
    nextSteps: "If you clicked a suspicious link, change your password immediately and check your account activity.",
  },
  {
    id: 3,
    content: "Use a unique, strong password for your Facebook account that you don't use anywhere else.",
    category: "passwords",
    explanation: "If you reuse passwords and one site gets hacked, attackers can use that password to access your Facebook. A unique password keeps your account safe even if other sites are breached.",
    nextSteps: "Use a password manager to generate and store strong, unique passwords.",
  },
  {
    id: 4,
    content: "Review your privacy settings regularly to control who can see your posts and personal info.",
    category: "privacy",
    explanation: "Facebook's privacy settings control who can see your posts, profile info, and friend list. Reviewing them regularly helps you stay in control.",
    nextSteps: "Go to Settings → Privacy to review and update your settings.",
  },
  {
    id: 5,
    content: "Keep your phone and computer updated with the latest security patches.",
    category: "devices",
    explanation: "Software updates fix security vulnerabilities that hackers could exploit. Running outdated software leaves you exposed to known attacks.",
    nextSteps: "Turn on automatic updates for your devices and apps.",
  },
  {
    id: 6,
    content: "Be cautious of friend requests from people you don't know — fake profiles are common.",
    category: "account",
    explanation: "Scammers create fake profiles to gather personal information or send phishing messages. Only accept friend requests from people you actually know.",
    nextSteps: "Review your friend list and remove anyone you don't recognize.",
  },
  {
    id: 7,
    content: "Don't share your phone number or address publicly on your profile.",
    category: "privacy",
    explanation: "Personal information like your phone number and address can be used for identity theft or harassment. Keep these details private.",
    nextSteps: "Check your profile info and remove any sensitive details that are visible to everyone.",
  },
  {
    id: 8,
    content: "Look for the padlock icon and \"https\" in the URL before entering your password on any site.",
    category: "phishing",
    explanation: "The padlock and https show the connection is encrypted. Fake sites often miss these or use http, which is insecure.",
    nextSteps: "Always check the URL bar before logging in. If something looks off, don't enter your password.",
  },
  {
    id: 9,
    content: "Log out of Facebook on shared or public computers after you're done.",
    category: "devices",
    explanation: "If you stay logged in on a shared computer, the next person can access your account. Always log out when you're finished.",
    nextSteps: "Use the \"Where you're logged in\" section in Settings to check and end sessions you don't recognize.",
  },
  {
    id: 10,
    content: "Use Facebook's Login Alerts to get notified of unrecognized logins.",
    category: "account",
    explanation: "Login Alerts send you a notification when someone accesses your account from an unfamiliar device or browser, so you can act quickly if it's not you.",
    nextSteps: "Go to Settings → Security and Login → Get alerts about unrecognized logins and turn them on.",
  },
];

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: TipCategory;
}

export const QUIZZES: QuizQuestion[] = [
  {
    question: "What does two-factor authentication add to your account security?",
    options: [
      "A second password",
      "A code from your phone plus your password",
      "A fingerprint scanner",
      "A security question",
    ],
    correctAnswer: 1,
    explanation: "2FA combines something you know (password) with something you have (your phone), making it much harder for attackers to break in.",
    topic: "account",
  },
  {
    question: "Which of these is the safest password?",
    options: [
      "password123",
      "MyDogRex2024",
      "xK9!mP2$vL8nQ",
      "12345678",
    ],
    correctAnswer: 2,
    explanation: "A truly strong password mixes random letters, numbers, and symbols. Dictionary words and predictable patterns are easy to guess.",
    topic: "passwords",
  },
  {
    question: "You receive a message saying \"Your Facebook account will be deleted — click here to verify.\" What should you do?",
    options: [
      "Click the link and enter your password",
      "Forward it to all your friends",
      "Ignore it — Facebook won't ask you to verify via a link in a message",
      "Reply with your phone number",
    ],
    correctAnswer: 2,
    explanation: "This is a classic phishing scam. Facebook will never ask you to verify your account through a link in a message.",
    topic: "phishing",
  },
  {
    question: "Where should you review who can see your Facebook posts?",
    options: [
      "News Feed",
      "Settings → Privacy",
      "Marketplace",
      "Messenger",
    ],
    correctAnswer: 1,
    explanation: "The Privacy settings page lets you control exactly who can see your posts, profile information, and friend list.",
    topic: "privacy",
  },
  {
    question: "Why are software updates important for security?",
    options: [
      "They add new emojis",
      "They fix known security vulnerabilities",
      "They make your device faster",
      "They're optional and don't matter",
    ],
    correctAnswer: 1,
    explanation: "Updates often include patches for security holes that hackers know about. Running outdated software leaves you exposed.",
    topic: "devices",
  },
  {
    question: "What should you do after using Facebook on a shared computer?",
    options: [
      "Just close the browser tab",
      "Leave it logged in for convenience",
      "Log out of your account",
      "Delete your browser history only",
    ],
    correctAnswer: 2,
    explanation: "Logging out ensures the next person using the computer can't access your account.",
    topic: "devices",
  },
  {
    question: "A friend sends you a link on Facebook saying \"You have to see this!\" but it looks unusual. What's the safest approach?",
    options: [
      "Click it immediately — it's from a friend",
      "Ask your friend if they actually sent it before clicking",
      "Share it with more friends first",
      "Enter your password on the page if it asks",
    ],
    correctAnswer: 1,
    explanation: "Your friend's account may have been compromised. Always verify before clicking unusual links, even from friends.",
    topic: "phishing",
  },
  {
    question: "What information should you keep private on your Facebook profile?",
    options: [
      "Your favorite color",
      "Your phone number and home address",
      "The name of your pet",
      "Your favorite movie",
    ],
    correctAnswer: 1,
    explanation: "Phone numbers and addresses can be used for identity theft, stalking, or targeted scams. Keep sensitive details private.",
    topic: "privacy",
  },
  {
    question: "How often should you review which devices are logged into your Facebook account?",
    options: [
      "Only when something seems wrong",
      "Once a year",
      "Regularly, at least once a month",
      "Never — Facebook handles it",
    ],
    correctAnswer: 2,
    explanation: "Regularly reviewing logged-in devices helps you spot unauthorized access early and remove it before damage is done.",
    topic: "account",
  },
  {
    question: "What is the best way to create a memorable but strong password?",
    options: [
      "Use your birthday with a number",
      "Use a passphrase like \"correct-horse-battery-staple\"",
      "Use the same password everywhere",
      "Use a single dictionary word",
    ],
    correctAnswer: 1,
    explanation: "Passphrases combine multiple random words, making them both memorable and extremely hard to crack. They're longer than typical passwords, which adds strength.",
    topic: "passwords",
  },
];

export function getTipsByCategory(category: TipCategory): Tip[] {
  return TIPS.filter((t) => t.category === category);
}

export function getRandomTip(): Tip {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}

export function getQuizzesByTopic(topic: TipCategory): QuizQuestion[] {
  return QUIZZES.filter((q) => q.topic === topic);
}
