export function getTurkishPossessive(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  
  const lastChar = lower.slice(-1);
  
  // Find last vowel
  let lastVowel = 'a';
  for (let i = lower.length - 1; i >= 0; i--) {
    if ('aeiouy'.includes(lower[i])) {
      lastVowel = lower[i];
      break;
    }
  }

  // If ends with vowel
  if ('aeiou'.includes(lastChar) || (lastChar === 'y' && !'aeiou'.includes(lower.slice(-2, -1)))) {
    if (['a', 'ı'].includes(lastVowel)) return `${trimmed}'sı`;
    if (['e', 'i', 'y'].includes(lastVowel)) return `${trimmed}'si`;
    if (['o', 'u'].includes(lastVowel)) return `${trimmed}'su`;
    return `${trimmed}'si`;
  }

  // If ends with consonant
  if (['a', 'ı'].includes(lastVowel)) return `${trimmed}'ı`;
  if (['e', 'i'].includes(lastVowel)) return `${trimmed}'i`;
  if (['o', 'u'].includes(lastVowel)) return `${trimmed}'u`;
  return `${trimmed}'i`;
}

export function formatCardTypeLabel(card: { supertype?: string; subtype?: string }, lang: Language): string {
  if (card.supertype === 'Energy') {
    if (card.subtype === 'Special' || card.subtype === 'Special Energy') {
      return lang === 'tr' ? 'Özel Energy' : 'Special Energy';
    }
    return lang === 'tr' ? 'Basic Energy' : 'Basic Energy';
  }
  if (card.supertype === 'Pokemon') {
    if (card.subtype === 'Basic') return 'Basic Pokémon';
    if (card.subtype === 'Stage 1') return lang === 'tr' ? '1. Aşama Evrim' : 'Stage 1 Evolution';
    if (card.subtype === 'Stage 2') return lang === 'tr' ? '2. Aşama Evrim' : 'Stage 2 Evolution';
    return card.subtype || 'Pokémon';
  }
  if (card.supertype === 'Trainer') {
    return lang === 'tr' ? 'Trainer Kartı' : 'Trainer Card';
  }
  return card.supertype || '';
}

export type Language = 'tr' | 'en';

export const TRANSLATIONS = {
  tr: {
    // General / Header
    gameTitle: 'POKÉMON TCG',
    gameSubtitle: 'Orijinal 1999 Klasik Kart Oyunu • 5 Genişleme Seti (435+ Kart) • Gerçek Zamanlı 1v1',
    badgeText: 'Orijinal 1999 Vintage Setler (Base, Jungle, Fossil, Base Set 2, Team Rocket) • Türkçe Sürüm',
    scale: 'Ölçek',
    language: 'Dil',
    backToMenu: 'Ana Menü',
    back: 'Geri',
    menu: 'Menü',
    onlineBadge: '1v1 Çevrimiçi',
    playerDefault: 'Oyuncu',
    cpuDefault: 'Gary (Rakip)',
    opponentDefault: 'Rakip',

    // Main Menu
    playMultiplayer: '⚔️ 1V1 ÇEVRİMİÇİ OYNA (ÇOK OYUNCULU)',
    orSolo: 'veya Bilgisayara Karşı Oyna (Solo)',
    yourDeck: 'Sizin Desteniz',
    cpuDeck: 'Bilgisayarın (Gary) Destesi',
    prizeCards: 'Ödül Kartı Sayısı',
    prizesDesc: '(Standart: 6 ödül, Hızlı Maç: 4 ödül)',
    difficultyLabel: 'Yapay Zeka Zorluk Seviyesi',
    diffEasy: '🌱 Acemi (Kolay)',
    diffMedium: '⚔️ Standart (Normal)',
    diffHard: '👑 Salon Lideri (Zor)',
    diffExpert: '🏆 Şampiyon (Usta)',
    diffEasyDesc: 'Temel hamleler yapar, rahat ve eğitici bir maç deneyimi.',
    diffMediumDesc: 'Dengeli yapay zeka stratejisi.',
    diffHardDesc: 'Agresif enerji dağıtımı, taktiksel geri çekilme ve eğitmen kartı kombinasyonları.',
    diffExpertDesc: 'En üst düzey yapay zeka: zayıflık sömürüsü, çoklu tur hesaplaması ve ödül yarışı optimizasyonu.',
    startBattle: 'SAVAŞI BAŞLAT',
    randomizeDecks: '🎲 Rastgele Deste Seç (Siz & Gary)',
    randomDeck: '🎲 Rastgele Deste',
    randomizeBtn: '🎲 Rastgele',
    customDecksGroup: '✨ Özel Desteleriniz',
    prebuiltDecksGroup: '📦 Hazır Tema Desteleri',
    deckBuilder: 'Deste Oluşturucu',
    ruleBook: 'Kural Kitapçığı',
    sound: 'Ses',

    // Rules Modal
    rulesTitle: '1999 Pokémon TCG Temel Kuralları',
    rule1Title: '1. Oyunun Amacı',
    rule1Text: 'Tüm Ödül Kartlarını (Prize Cards) ilk alan veya rakibin sahadaki tüm Pokémonlarını bayıltan oyuncu maçı kazanır.',
    rule2Title: '2. Tur Döngüsü',
    rule2Text: 'Her turda 1 kart çekersiniz. Tur başına en fazla 1 Enerji ekleyebilir ve en fazla 1 Eğitmen (Trainer) kartı oynayabilirsiniz. İstediğiniz kadar Basic Pokémonu yedek kulübesine (Bench) koyabilirsiniz.',
    rule3Title: '3. Evrim Kuralları',
    rule3Text: 'Bir Pokémon oyuna girdiği ilk tur veya maçın 1. turunda evrimleşemez. Evrimleştiğinde üzerindeki tüm durum etkileri (Felç, Uyku vb.) temizlenir.',
    rule4Title: '4. Durum Etkileri',
    rule4Text: '⚡ Felç: Saldıramaz ve geri çekilemez. 💤 Uyku: Saldıramaz ve geri çekilemez (tur sonunda %50 uyanma şansı). 😵 Kafa Karışıklığı: Saldırırken yazı-tura atılır; tura gelirse 20 hasar kendine vurur. ☠️ Zehir: Tur aralarında 10 hasar alır.',
    close: 'Kapat',

    // Multiplayer Lobby
    lobbyTitle: 'POKÉMON TCG ÇEVRİMİÇİ ARENA',
    lobbyBadge: '1v1 Çevrimiçi Çok Oyunculu',
    trainerNameLabel: 'Eğitmen Kullanıcı Adı:',
    trainerNamePlaceholder: 'Eğitmen Adınızı Girin',
    createRoomTab: 'Oda Kur (Host)',
    joinRoomTab: 'Odaya Katıl (Guest)',
    createRoomBtn: '🎮 Yeni Maç Odası Kur',
    joinRoomBtn: '⚡ Odaya Katıl',
    roomCodeLabel: 'Oda Kodu:',
    roomCodePlaceholder: 'Oda Kodunu Girin (örn: PIKA-42)',
    copyLink: 'Davet Linkini Kopyala',
    linkCopied: 'Link Kopyalandı!',
    waitingOpponent: 'Rakip bekleniyor...',
    opponentConnected: 'Rakip odaya bağlandı!',
    startGameHost: '🚀 MAÇI BAŞLAT',
    guestWaitingHost: 'Host maçın başlamasını bekliyor...',
    opponentLabel: 'Rakip',
    generateOnlineRoom: '🎮 ÇEVRİMİÇİ ODA OLUŞTUR',
    shareRoomCode: 'Bu Oda Kodunu rakibinizle paylaşın:',
    copyDirectLink: 'Doğrudan Maç Linkini Kopyala',
    enterRoomCode: 'Oda Kodunu Girin',
    connectingToRoom: 'ODAYA BAĞLANILIYOR...',
    joinMatchBtn: 'MAÇA KATIL',
    bothConnected: 'İki Oyuncu da Bağlandı',
    hostPlayer1: 'Kurucu (1. Oyuncu)',
    guestPlayer2: 'Misafir (2. Oyuncu)',
    youLabel: '(Siz)',
    readyBadge: 'Hazır',
    sayHello: 'Rakibinize selam gönderin!',
    quickMessagePlaceholder: 'Hızlı mesaj...',
    sendBtn: 'Gönder',
    startOnlineMatchBtn: '🚀 1V1 ÇEVRİMİÇİ MAÇI BAŞLAT',
    waitingHostStart: '⏳ Kurucunun maçı başlatması bekleniyor...',
    prizeCardsFormat: 'Ödül Kartı Formatı',
    prizes6Standard: '6 Ödül (Standart)',
    prizes4Quick: '4 Ödül (Hızlı)',
    prizes2Practice: '2 Ödül (Alıştırma)',

    // Game Board & Field
    hand: 'El',
    deck: 'Deste',
    cards: 'Kart',
    yourActive: 'Sizin Aktif Pokémonunuz',
    opponentActive: 'Rakibin Aktif Pokémonu',
    yourPrizes: 'Ödülleriniz',
    opponentPrizes: 'Rakibin Ödülleri',
    bench: 'Yedek',
    prizeSlot: 'Ödül',
    deckSlot: 'Deste',
    discardSlot: 'Iskarta Yığını (Discard)',
    yourHand: 'Elinizdeki Kartlar',
    noHandCards: 'Elinizde kart yok',
    waitingOpponentActive: 'Rakibin Aktif Pokémonu Bekleniyor...',
    placeStartingActive: 'Başlangıç Aktif Pokémonu Koy',
    activeSlot: 'Aktif Yuvası',
    sendOut: 'Sahaya Sür',
    switchIn: 'Oyuna Al',
    opponentPlayedTrainer: 'Rakip Eğitmen Kartı Oynadı',
    youPlayedTrainer: 'Eğitmen Kartı Oynadınız',
    opponentTakingTurn: 'Rakip hamlesini yapıyor...',
    yourTurn: 'SİZİN TURUNUZ',
    opponentTurn: 'RAKİBİN TURU',
    turnNum: 'Tur',
    step1SelectActive: '⚡ 1. ADIM: Başlangıç Aktif Pokémonunuzu Seçin',
    noBasicOpeningHand: 'Açılış elinde Basic Pokémon yok! Aşağıdan yeniden karın',
    activeKnockedOutChoose: 'Aktif Pokémon Bayıldı! Yedek kulübenizden bir Pokémon seçin',

    // Tips
    tipMulligan: '👉 Komut Merkezindeki "Eli Yeniden Kar ve 7 Kart Çek" butonuna tıklayın',
    tipSetup: '👉 Elinizden bir Basic Pokémon seçip "Aktif Yap" butonuna tıklayın',
    tipKnockout: '👉 Yukarıdaki yedek kulübenizden yeni Aktif Pokémon olarak sürmek istediğinizi seçin',
    tipNormal: '👉 Kartları inceleyin • Enerji veya Evrim eklemek için sahadaki Pokémona tıklayın',
    setActiveShort: 'Aktif Yap',

    // Command Center
    commandCenter: 'Komut Merkezi',
    energyBadge: '✓ Enerji',
    trainerBadge: '✓ Eğitmen',
    mulliganTitle: 'Açılış Elinde Basic Pokémon Yok!',
    mulliganDesc: 'Resmi TCG kurallarına göre oyuna bir Basic Pokémon ile başlamalısınız. Elinizi desteye karıp 7 yeni kart çekin:',
    mulliganBtn: 'Eli Yeniden Kar ve 7 Kart Çek',
    selectReplacementTitle: 'Sahaya Çıkacak Yedek Pokémonu Seçin',
    selectReplacementDesc: 'Aktif Pokémonunuz bayıldı! Sahaya sürmek için yedekten bir Pokémon seçin:',
    retreatTitle: 'Aktif Pokémonu Değiştir (Geri Çekil)',
    retreatDesc: 'Yeni Aktif Pokémonunuz olacak yedek Pokémonu seçin:',
    cancel: 'İptal',
    setupSelectActiveDesc: 'Oyuna başlamak için elinizdeki Basic Pokémonlardan birini seçip Aktif konuma yerleştirin:',
    setAsActiveBtn: 'Aktife Yerleştir',
    clickBasicInHandPrompt: 'Seçmek için elinizdeki Basic Pokémonlardan birine tıklayın.',
    selectedCard: 'Seçilen Kart',
    putOnBenchBtn: 'Yedek Kulübesine Koy',
    cannotEvolveTurn1: '⚠️ Pokémonlar maçın 1. turunda evrimleşemez.',
    cannotEvolveTurnEntered: 'Bu tur oyuna giren Pokémon evrimleşemez (1 tur beklenmeli).',
    evolveActiveBtn: '▲ Aktif Pokémonu Evrimleştir',
    evolveBenchedBtn: '▲ Yedek Pokémonu Evrimleştir',
    energyAttachedTurnLimit: 'Bu tur zaten bir Enerji kartı eklediniz (tur başına 1 sınır).',
    attachToActiveBtn: '⚡ Aktife Enerji Ekle',
    attachToBenchBtn: '⚡ Yedeğe Enerji Ekle',
    trainerPlayedTurnLimit: '⚠️ Bu tur zaten bir Eğitmen kartı oynadınız (tur başına 1 sınır).',
    playTrainerBtn: '▶ Eğitmen Kartını Oyna',
    attacksTitle: 'Saldırılar',
    paralyzedStatus: '⚡ Paralysis (Saldıramaz / Geri Çekilemez)',
    asleepStatus: '💤 Sleep (Saldıramaz / Geri Çekilemez)',
    confusedStatus: '😵 Confusion',
    poisonedStatus: '☠️ Poisoned',
    toxicStatus: '☠️ Toxic',
    dmgText: 'HASAR',
    effectText: 'ETKİ',
    retreatBtn: 'Geri Çekil',
    passTurnBtn: 'Turu Bitir',
    retreatedThisTurn: 'Bu tur zaten geri çekildiniz',
    notEnoughEnergyRetreat: 'Geri çekilmek için yetersiz enerji',

    // Win / Lose Modal
    winnerTitle: 'Tebrikler, Kazandınız!',
    loserTitle: 'Maç Sona Erdi!',
    rematchBtn: 'Yeniden Oyna',
    exitMenuBtn: 'Menüye Dön',

    // Log & Chat
    battleLogTab: 'Savaş Kaydı',
    liveChatTab: 'Canlı Sohbet',
    typeMessagePlaceholder: 'Mesaj yaz...',
    onlineStatus: 'Çevrimiçi',
    noMessages: 'Henüz mesaj yok. Rakibinize selam gönderin!',
    quickPhrases: [
      '🔥 İyi şanslar!',
      '⚡ Güzel hamle!',
      '🛡️ İyi oynadın!',
      '😮 Vay canına!',
      '😎 GG (İyi Oyundu)!',
      '⏱️ Düşünüyorum...'
    ],

    // Card Zoom Modal
    evolvesFrom: 'Evrimleştiği Pokémon:',
    pokemonPower: 'Pokémon Özel Gücü:',
    attacks: 'Saldırılar',
    weakness: 'Zayıflık:',
    resistance: 'Direnç:',
    retreatCost: 'Geri Çekilme Bedeli:',
    none: 'Yok',
    inPlayStatus: 'Sahadaki Durum',
    currentHp: 'Mevcut Can (HP)',
    statusCondition: 'Durum Etkisi:',
    healthy: 'Sağlıklı',
    attachedEnergy: 'Ekli Enerji Kartları:',
    turnsInPlay: 'Oyundaki Tur Sayısı:',
    turns: 'tur',

    // Coin Flip Modal
    flippingCoins: 'Yazı-Tura Atılıyor...',
    coinFlipResult: 'Yazı-Tura Sonucu:',
    heads: 'TURA (HEADS)',
    tails: 'YAZI (TAILS)',

    // Deck Builder
    builderTitle: 'ÖZEL DESTE OLUŞTURUCU',
    builderSubtitle: '102 Orijinal Base Set Kartından 60 Kartlık Deste Hazırlayın',
    allCards: 'Tümü',
    pokemonFilter: 'Pokémon',
    energyFilter: 'Enerji',
    trainerFilter: 'Eğitmen',
    deckCount: 'Deste',
    clearDeck: 'Desteyi Temizle',
    saveAndPlay: 'Kaydet ve Oyna',
    need60Cards: 'Desteniz tam 60 kart olmalıdır',
    deckBuilderTitle: 'DESTE OLUŞTURUCU & KART KATALOĞU',
    all102Cards: 'Tüm 102 Base Set Kartı (1999)',
    loadThemeDeck: 'Hazır Deste Yükle:',
    playWithThisDeck: 'Bu Deste ile Oyna',
    searchCardsPlaceholder: 'Kart ara...',
    allCardTypes: 'Tüm Türler (Pokémon / Eğitmen / Enerji)',
    allElements: 'Tüm Elementler',
    clear: 'Temizle',
    deckIsEmpty: 'Deste boş. Eklemek için soldaki kartlara tıklayın veya sürükleyip bırakın!',
    customDeckDefault: 'Özel Deste',
    viewMode: 'Görünüm',
    listView: 'Liste',
    visualView: 'Görsel',
    saveDeck: 'Desteyi Kaydet',
    savedDecks: 'Kayıtlı Desteler',
    newDeck: 'Yeni Deste',
    exportDeck: 'Dışa Aktar',
    importDeck: 'İçe Aktar',
    copyDeck: 'Kopyala',
    dragDropNotice: 'Kartları buraya sürükleyip bırakabilir veya tıklayarak ekleyebilirsiniz.',
    deleteSavedDeck: 'Desteyi Sil',
    deckSavedSuccess: 'Deste başarıyla kaydedildi!',
    deckImportSuccess: 'Deste başarıyla içe aktarıldı!',
    invalidDeckFile: 'Geçersiz deste dosyası!',
    uniqueCards: 'Benzersiz Kart',
    resetView: 'Görünümü Sıfırla',
    resetViewSuccess: 'Görünüm varsayılana sıfırlandı!'
  },
  en: {
    // General / Header
    gameTitle: 'POKÉMON TCG',
    gameSubtitle: 'Original 1999 Classic Card Game • 102 Cards • Real-Time 1v1',
    badgeText: 'Original 1999 Base Set • English Edition',
    scale: 'Scale',
    language: 'Language',
    backToMenu: 'Back to Menu',
    back: 'Back',
    menu: 'Menu',
    onlineBadge: '1v1 Online',
    playerDefault: 'Player',
    cpuDefault: 'Gary (Opponent)',
    opponentDefault: 'Opponent',

    // Main Menu
    playMultiplayer: '⚔️ PLAY 1V1 ONLINE (MULTIPLAYER)',
    orSolo: 'or Play Solo vs CPU',
    yourDeck: 'Your Deck',
    cpuDeck: 'CPU Opponent Deck',
    prizeCards: 'Prize Cards Count',
    prizesDesc: '(Standard: 6 prizes, Fast Match: 4 prizes)',
    difficultyLabel: 'AI Difficulty Level',
    diffEasy: '🌱 Casual (Easy)',
    diffMedium: '⚔️ Standard (Normal)',
    diffHard: '👑 Gym Leader (Hard)',
    diffExpert: '🏆 Champion (Master)',
    diffEasyDesc: 'Basic plays, relaxed and educational experience.',
    diffMediumDesc: 'Balanced tactical decision making.',
    diffHardDesc: 'Aggressive energy allocation, tactical retreats, and smart Trainer usage.',
    diffExpertDesc: 'Top-tier master AI: weakness exploitation, multi-turn lookahead, and prize denial.',
    startBattle: 'START BATTLE',
    randomizeDecks: '🎲 Randomize Decks (You & CPU)',
    randomDeck: '🎲 Random Deck',
    randomizeBtn: '🎲 Randomize',
    customDecksGroup: '✨ Your Custom Decks',
    prebuiltDecksGroup: '📦 Prebuilt Theme Decks',
    deckBuilder: 'Deck Builder',
    ruleBook: 'Rule Book',
    sound: 'Sound',

    // Rules Modal
    rulesTitle: '1999 Pokémon TCG Official Rules',
    rule1Title: '1. Objective',
    rule1Text: 'Draw all Prize Cards first or Knock Out all of the opponent’s in-play Pokémon to win.',
    rule2Title: '2. Turn Structure',
    rule2Text: 'Draw 1 card at the start of your turn. You can attach 1 Energy per turn and play 1 Trainer card per turn. Bench as many Basic Pokémon as you want.',
    rule3Title: '3. Evolution Rules',
    rule3Text: 'A Pokémon cannot evolve on Turn 1 of the game or on the same turn it entered play. Evolving removes all status conditions (Paralysis, Sleep, etc.).',
    rule4Title: '4. Status Conditions',
    rule4Text: '⚡ Paralyzed: Cannot attack or retreat. 💤 Asleep: Cannot attack or retreat (50% wake up check each turn). 😵 Confused: Flip a coin on attack; on tails, take 20 damage. ☠️ Poisoned: Takes 10 damage between turns.',
    close: 'Close',

    // Multiplayer Lobby
    lobbyTitle: 'POKÉMON TCG ONLINE ARENA',
    lobbyBadge: '1v1 Online Multiplayer',
    trainerNameLabel: 'Trainer Username:',
    trainerNamePlaceholder: 'Enter Trainer Name',
    createRoomTab: 'Create Room (Host)',
    joinRoomTab: 'Join Room (Guest)',
    createRoomBtn: '🎮 Create Match Room',
    joinRoomBtn: '⚡ Join Room',
    roomCodeLabel: 'Room Code:',
    roomCodePlaceholder: 'Enter Room Code (e.g. PIKA-42)',
    copyLink: 'Copy Room Link',
    linkCopied: 'Link Copied!',
    waitingOpponent: 'Waiting for opponent to join...',
    opponentConnected: 'Opponent connected to lobby!',
    startGameHost: '🚀 START GAME',
    guestWaitingHost: 'Waiting for host to start the match...',
    opponentLabel: 'Opponent',
    generateOnlineRoom: '🎮 GENERATE ONLINE ROOM',
    shareRoomCode: 'Share this Room Code with your opponent:',
    copyDirectLink: 'Copy Direct Match Link',
    enterRoomCode: 'Enter Room Code',
    connectingToRoom: 'CONNECTING TO ROOM...',
    joinMatchBtn: 'JOIN MATCH',
    bothConnected: 'Both Players Connected',
    hostPlayer1: 'Host (Player 1)',
    guestPlayer2: 'Guest (Player 2)',
    youLabel: '(You)',
    readyBadge: 'Ready',
    sayHello: 'Say hello to your opponent!',
    quickMessagePlaceholder: 'Quick message...',
    sendBtn: 'Send',
    startOnlineMatchBtn: '🚀 START 1V1 ONLINE MATCH',
    waitingHostStart: '⏳ Waiting for host to launch the battle...',
    prizeCardsFormat: 'Prize Cards Format',
    prizes6Standard: '6 Prizes (Standard)',
    prizes4Quick: '4 Prizes (Quick)',
    prizes2Practice: '2 Prizes (Practice)',

    // Game Board & Field
    hand: 'Hand',
    deck: 'Deck',
    cards: 'Cards',
    yourActive: 'Your Active',
    opponentActive: 'Opponent Active',
    yourPrizes: 'Your Prizes',
    opponentPrizes: 'Opponent Prizes',
    bench: 'Bench',
    prizeSlot: 'Prize',
    deckSlot: 'Deck',
    discardSlot: 'Discard',
    yourHand: 'Your Hand',
    noHandCards: 'No cards in hand',
    waitingOpponentActive: 'Waiting for Opponent Active...',
    placeStartingActive: 'Place Starting Active',
    activeSlot: 'Active Slot',
    sendOut: 'Send Out',
    switchIn: 'Switch In',
    opponentPlayedTrainer: 'Opponent played Trainer',
    youPlayedTrainer: 'You played Trainer',
    opponentTakingTurn: 'Opponent is Taking Turn...',
    yourTurn: 'YOUR TURN',
    opponentTurn: 'OPPONENT TURN',
    turnNum: 'Turn',
    step1SelectActive: '⚡ STEP 1: Select Your Starting Active Pokémon',
    noBasicOpeningHand: 'No Basic Pokémon in Opening Hand! Click Reshuffle Below',
    activeKnockedOutChoose: 'Active Pokémon Knocked Out! Select a Pokémon From Your Bench',

    // Tips
    tipMulligan: '👉 Click "Reshuffle Hand & Draw 7 Cards" in Command Center',
    tipSetup: '👉 Click any Basic Pokémon in your hand, then click "Set as Active"',
    tipKnockout: '👉 Click any Pokémon on your bench above to send out as Active',
    tipNormal: '👉 Click card to inspect actions • Click Pokémon on board to attach or evolve',
    setActiveShort: 'Set Active',

    // Command Center
    commandCenter: 'Command Center',
    energyBadge: '✓ Energy',
    trainerBadge: '✓ Trainer',
    mulliganTitle: 'No Basic Pokémon in Opening Hand!',
    mulliganDesc: 'According to official TCG rules, you must start with a Basic Pokémon. Reshuffle your hand into your deck and draw 7 fresh cards:',
    mulliganBtn: 'Reshuffle Hand & Draw 7 Cards',
    selectReplacementTitle: 'Choose Benched Pokémon to Send Out',
    selectReplacementDesc: 'Your Active Pokémon was Knocked Out! Click any Pokémon on your bench or choose from this list:',
    retreatTitle: 'Switch Active Pokémon (Retreat)',
    retreatDesc: 'Choose which Pokémon from your bench will become your new Active Pokémon:',
    cancel: 'Cancel',
    setupSelectActiveDesc: 'Select a Basic Pokémon from your hand below to place as your starting Active Pokémon:',
    setAsActiveBtn: 'Set as Starting Active Pokémon',
    clickBasicInHandPrompt: 'Click any Basic Pokémon in your hand (at the bottom) to select it.',
    selectedCard: 'Selected Card',
    putOnBenchBtn: 'Put on Bench',
    cannotEvolveTurn1: '⚠️ Pokémon cannot evolve on Turn 1 of the game.',
    cannotEvolveTurnEntered: 'Cannot evolve on the turn it entered play (must wait 1 turn).',
    evolveActiveBtn: '▲ Evolve Active',
    evolveBenchedBtn: '▲ Evolve Benched',
    energyAttachedTurnLimit: 'You have already attached an Energy card this turn (1 per turn limit).',
    attachToActiveBtn: '⚡ Attach to Active',
    attachToBenchBtn: '⚡ Attach to Bench',
    trainerPlayedTurnLimit: '⚠️ You have already played a Trainer card this turn (1 per turn limit).',
    playTrainerBtn: '▶ Play Trainer Card',
    attacksTitle: 'Attacks',
    paralyzedStatus: '⚡ Paralyzed (Cannot Attack / Retreat)',
    asleepStatus: '💤 Asleep (Cannot Attack / Retreat)',
    confusedStatus: '😵 Confused',
    poisonedStatus: '☠️ Poisoned',
    toxicStatus: '☠️ Toxic',
    dmgText: 'DMG',
    effectText: 'EFFECT',
    retreatBtn: 'Retreat',
    passTurnBtn: 'End Turn',
    retreatedThisTurn: 'Already retreated this turn',
    notEnoughEnergyRetreat: 'Not enough energy to retreat',

    // Win / Lose Modal
    winnerTitle: 'Victory! You Won!',
    loserTitle: 'Match Over!',
    rematchBtn: 'Rematch',
    exitMenuBtn: 'Exit to Menu',

    // Log & Chat
    battleLogTab: 'Battle Log',
    liveChatTab: 'Match Chat',
    typeMessagePlaceholder: 'Type message...',
    onlineStatus: 'Online',
    noMessages: 'No messages yet. Say hello to your opponent!',
    quickPhrases: [
      '🔥 Good luck!',
      '⚡ Nice move!',
      '🛡️ Well played!',
      '😮 Wow!',
      '😎 GG!',
      '⏱️ Thinking...'
    ],

    // Card Zoom Modal
    evolvesFrom: 'Evolves from:',
    pokemonPower: 'Pokémon Power:',
    attacks: 'Attacks',
    weakness: 'Weakness:',
    resistance: 'Resistance:',
    retreatCost: 'Retreat Cost:',
    none: 'None',
    inPlayStatus: 'In-Play Status',
    currentHp: 'Current HP',
    statusCondition: 'Status Condition:',
    healthy: 'Healthy',
    attachedEnergy: 'Attached Energy Cards:',
    turnsInPlay: 'Turns in play:',
    turns: 'turns',

    // Coin Flip Modal
    flippingCoins: 'Flipping coins...',
    coinFlipResult: 'Coin Flip Result:',
    heads: 'HEADS',
    tails: 'TAILS',

    // Deck Builder
    builderTitle: 'CUSTOM DECK BUILDER',
    builderSubtitle: 'Construct a 60-Card Deck from 102 Original Base Set Cards',
    allCards: 'All',
    pokemonFilter: 'Pokémon',
    energyFilter: 'Energy',
    trainerFilter: 'Trainer',
    deckCount: 'Deck',
    clearDeck: 'Clear Deck',
    saveAndPlay: 'Save & Play',
    need60Cards: 'Your deck must have exactly 60 cards',
    deckBuilderTitle: 'DECK BUILDER & CARD BROWSER',
    all102Cards: 'All 102 Base Set Cards (1999)',
    loadThemeDeck: 'Load Theme Deck:',
    playWithThisDeck: 'Play with this Deck',
    searchCardsPlaceholder: 'Search cards...',
    allCardTypes: 'All Types (Pokémon / Trainer / Energy)',
    allElements: 'All Elements',
    clear: 'Clear',
    deckIsEmpty: 'Deck is empty. Click any card on the left or drag & drop to add!',
    customDeckDefault: 'Custom Deck',
    viewMode: 'View',
    listView: 'List',
    visualView: 'Visual',
    saveDeck: 'Save Deck',
    savedDecks: 'Saved Decks',
    newDeck: 'New Deck',
    exportDeck: 'Export',
    importDeck: 'Import',
    copyDeck: 'Copy',
    dragDropNotice: 'Drag & drop cards here or click from the gallery to add.',
    deleteSavedDeck: 'Delete Deck',
    deckSavedSuccess: 'Deck saved successfully!',
    deckImportSuccess: 'Deck imported successfully!',
    invalidDeckFile: 'Invalid deck file!',
    uniqueCards: 'Unique Cards',
    resetView: 'Reset View',
    resetViewSuccess: 'View reset to default!'
  }
};

export function translateLog(text: string, lang: Language): string {
  if (lang === 'en' || !text) return text;

  let s = text;

  // 0. Evolution & Rule Warning Banners
  s = s.replace(/Cannot evolve (.*?) on the turn it entered play! Must wait 1 turn\./gi, '$1 oyuna girdiği tur evrimleşemez! (1 tur beklenmeli)');
  s = s.replace(/Cannot evolve on Turn 1 of the game!/gi, 'Maçın 1. turunda evrimleşilemez!');
  s = s.replace(/You have already played a Trainer card this turn \(1 per turn limit\)!/gi, 'Bu tur zaten bir Trainer kartı oynadınız (tur başına 1 sınır)!');
  s = s.replace(/You have already attached an Energy card this turn \(1 per turn limit\)!/gi, 'Bu tur zaten bir Energy kartı eklediniz (tur başına 1 sınır)!');
  s = s.replace(/Retreating (.*?) and sending out (.*?)!/gi, '$1 geri çekilip $2 sahaya sürülüyor!');


  // 1. Coin Toss Reason Translators with Turkish Possessive Inflections
  s = s.replace(/Flipping (\d+) coin(?:s)? for (.*?)$/gi, '$2 için $1 adet Yazı-Tura atılıyor');
  s = s.replace(/Flipping one coin for (.*?)$/gi, '$1 için 1 adet Yazı-Tura atılıyor');
  s = s.replace(/Flipping a coin for (.*?)$/gi, '$1 için 1 adet Yazı-Tura atılıyor');
  
  s = s.replace(/Opponent's (.*?) using (.*?)$/gi, (_, name, atk) => `Rakibin ${getTurkishPossessive(name)}, ${atk} saldırısını kullanıyor`);
  s = s.replace(/Opponent's (.*?) is using (.*?)$/gi, (_, name, atk) => `Rakibin ${getTurkishPossessive(name)}, ${atk} saldırısını kullanıyor`);
  s = s.replace(/(.*?) using (.*?)$/gi, '$1, $2 saldırısını kullanıyor');
  s = s.replace(/(.*?) is using (.*?)$/gi, '$1, $2 saldırısını kullanıyor');
  s = s.replace(/Confusion check: (.*)/gi, 'Confusion kontrolü: $1');
  s = s.replace(/Sleep check: (.*)/gi, 'Sleep kontrolü: $1');
  s = s.replace(/Paralysis check: (.*)/gi, 'Paralysis kontrolü: $1');
  s = s.replace(/Confusion check/gi, 'Confusion kontrolü');
  s = s.replace(/Sleep check/gi, 'Sleep kontrolü');
  s = s.replace(/Paralysis check/gi, 'Paralysis kontrolü');

  // 2. Specific Game Over & Knockout Reasons
  s = s.replace(/(?:Oyuncu|Player) has no remaining Pokémon in play!/gi, 'Sahadaki tüm Pokémonlarınız tükendi!');
  s = s.replace(/(?:Rakip|Gary (Rakip)|Opponent|Gary (Opponent)) has no remaining Pokémon in play!/gi, 'Rakibin sahadaki tüm Pokémonları tükendi!');
  s = s.replace(/(.*?) has no remaining Pokémon in play!/g, '$1 tarafının sahadaki tüm Pokémonları tükendi!');

  s = s.replace(/(?:Oyuncu|Player) took all Prize Cards!/gi, 'Tüm Ödül Kartlarını topladınız!');
  s = s.replace(/(?:Rakip|Gary (Rakip)|Opponent|Gary (Opponent)) took all Prize Cards!/gi, 'Rakip tüm Ödül Kartlarını topladı!');
  s = s.replace(/(.*?) took all Prize Cards!/g, '$1 tüm Ödül Kartlarını topladı!');

  s = s.replace(/You have won the Pokémon TCG match!/g, 'Tebrikler! Pokémon TCG maçını kazandınız!');
  s = s.replace(/CPU opponent won the match\./g, 'Rakibiniz maçı kazandı.');
  s = s.replace(/Choose your next Active Pokémon from the bench!/g, 'Yedek kulübenizden yeni Aktif Pokémonunuzu seçin!');
  s = s.replace(/Opponent has no more Pokémon on the bench or field!/g, 'Rakibin sahada veya yedekte başka Pokémonu kalmadı!');
  s = s.replace(/Player has no more Pokémon on the bench or field!/g, 'Sahada veya yedekte başka Pokémonunuz kalmadı!');
  s = s.replace(/Sending out (.*?)!/g, '$1 sahaya sürülüyor!');

  // 3. Action Banners & Step Descriptions with Possessive
  s = s.replace(/⚔️ Opponent's (.*?) is using (.*?)!/g, (_, name, atk) => `⚔️ Rakibin ${getTurkishPossessive(name)}, ${atk} saldırısını kullanıyor!`);
  s = s.replace(/⚔️ Opponent's (.*?) used (.*?)!/g, (_, name, atk) => `⚔️ Rakibin ${getTurkishPossessive(name)}, ${atk} saldırısını kullandı!`);
  s = s.replace(/Opponent used Potion on (.*?) \(\+20 HP\)!/g, 'Rakip, $1 üzerine Potion kullandı (+20 HP)!');
  s = s.replace(/Opponent played Bill and drew 2 cards\./g, 'Rakip, Bill oynadı ve 2 kart çekti.');
  s = s.replace(/Opponent placed (.*?) on the bench\./g, 'Rakip, $1 kartını yedeğe koydu.');
  s = s.replace(/Opponent benched (.*?)\./g, 'Rakip, $1 kartını yedeğe koydu.');
  s = s.replace(/Opponent evolved (.*?) into (.*?)!/g, 'Rakip, $1 evrimleştirip $2 yaptı!');
  s = s.replace(/Opponent evolved into (.*?)!/g, 'Rakip, $1 evrimleştirdi!');
  s = s.replace(/Opponent attached (.*?) to (.*?)\./g, 'Rakip, $2 üzerine $1 ekledi.');
  s = s.replace(/Opponent attached (.*?)\./g, 'Rakip, $1 kartını ekledi.');
  s = s.replace(/Opponent played (.*?)!/g, 'Rakip, $1 kartını oynadı!');
  s = s.replace(/Opponent passed the turn\./g, 'Rakip turu pas geçti.');
  s = s.replace(/Opponent ended turn\./g, 'Rakip turunu bitirdi.');
  s = s.replace(/Opponent switched Active Pokémon!/g, 'Rakip Aktif Pokémonunu değiştirdi!');
  s = s.replace(/💀 Your (.*?) was Knocked Out!/g, '💀 $1 Bayıldı!');
  s = s.replace(/🔄 Mulligan! Reshuffling hand and drawing 7 new cards\.\.\./g, '🔄 Mulligan! El yeniden karılıp 7 yeni kart çekiliyor...');
  s = s.replace(/🔄 Mulligan! (.*?) reshuffled hand into deck and drew 7 new cards\./g, '🔄 Mulligan! $1 elini desteye karıp 7 yeni kart çekti.');

  // 4. Combat & Log Actions
  s = s.replace(/💻 (.*?) played Computer Search! Discarded 2 cards and retrieved (.*?) from deck!/g, '💻 $1 Computer Search oynadı! Elinden 2 kart atıp desteden $2 kartını seçip eline aldı!');
  s = s.replace(/⚡ (.*?) is Paralyzed and cannot move! Turn skipped./g, '⚡ $1 Paralysis (Felç) durumunda olduğu için hareket edemedi! Tur pas geçildi.');

  s = s.replace(/✨ (.*?)'s (.*?) used Lure! Dragged (.*?) into the Active position!/g, '✨ $1 $2 ile Lure kullandı! $3 Aktif pozisyona çekildi!');
  s = s.replace(/💨 Whirlwind forced (.*?)'s (.*?) into the Active position!/g, '💨 Whirlwind rüzgarı $1 $2 Pokémonunu aktife savurdu!');
  s = s.replace(/💧 (.*?) discarded (.*?) from (.*?)!/g, '💧 $1, $3 Pokémonundan $2 kartını ıskartaya attı!');
  s = s.replace(/✨ (.*?) used Recover! Discarded 1 Energy and fully restored HP \((.*?)\)!/g, '✨ $1 Recover kullandı! 1 Energy atarak tüm canını yeniledi ($2)!');
  s = s.replace(/🛡️ Coin flip: HEADS! (.*?) will prevent all attack damage during opponent's next turn!/g, '🛡️ Yazı-Tura: TURA! $1 rakibin gelecek turundaki tüm saldırı hasarını engelleyecek!');
  s = s.replace(/🛡️ (.*?) protected itself and prevented all attack damage!/g, '🛡️ $1 kendini korudu ve gelen tüm saldırı hasarını sıfırladı!');
  s = s.replace(/⚡ Coin flip: HEADS! (.*?) is super agile and will prevent all damage and effects next turn!/g, '⚡ Yazı-Tura: TURA! $1 Agility ile gelecek tur tüm hasar ve etkilerden kaçınacak!');
  s = s.replace(/🪨 Onix hardened its body! Will prevent 30 or less damage next turn\./g, '🪨 Onix Harden kullandı! Gelecek tur 30 ve altındaki hasarları engelleyecek.');
  s = s.replace(/🪨 (.*?)'s Harden prevented all damage \(30 or less damage\)!/g, '🪨 $1 Harden kalkanıyla 30 ve altındaki tüm hasarı engelledi!');
  s = s.replace(/⏳ (.*?): Applied accuracy penalty to (.*?)! \(Must flip heads next turn to attack\)/g, '⏳ $1: $2 Pokémonuna doğruluk cezası uyguladı! (Saldırmak için gelecek tur Tura gelmeli)');
  s = s.replace(/⏳ (.*?) check: TAILS! (.*?)'s attack failed due to (.*?)!/g, '⏳ $1 kontrolü: YAZI! $2 saldırısı $3 nedeniyle başarısız oldu!');
  s = s.replace(/⏳ (.*?) check: HEADS! (.*?) overcame (.*?) accuracy penalty\./g, '⏳ $1 kontrolü: TURA! $2 $3 doğruluk cezasını aştı.');
  s = s.replace(/❄️ Blizzard: HEADS! 10 damage dealt to each opponent benched Pokémon!/g, '❄️ Blizzard: TURA! Rakibin tüm yedek Pokémonlarına 10 hasar verildi!');
  s = s.replace(/❄️ Blizzard: TAILS! 10 damage dealt to each of your own benched Pokémon!/g, '❄️ Blizzard: YAZI! Kendi tarafınızdaki tüm yedek Pokémonlara 10 hasar verildi!');
  s = s.replace(/⚡ Gigaspark: HEADS! (.*?) is now Paralyzed and 10 damage dealt to each opponent benched Pokémon!/g, '⚡ Gigaspark: TURA! $1 felç oldu ve rakibin tüm yedek Pokémonlarına 10 hasar verildi!');
  s = s.replace(/⚡ Gigaspark: TAILS! No bench damage or paralysis applied\./g, '⚡ Gigaspark: YAZI! Yedek hasarı veya felç etkisi uygulanmadı.');
  s = s.replace(/⚡ Thunderstorm: (\d+) tails! Zapdos dealt (\d+) recoil damage to itself!/g, '⚡ Thunderstorm: $1 Yazı! Zapdos kendine $2 tepme hasarı verdi!');
  s = s.replace(/⚡ Thunderstorm struck opponent's bench!/g, '⚡ Thunderstorm rakibin yedek Pokémonlarını vurdu!');
  s = s.replace(/⚡ Thunder Attack: HEADS! (.*?) is now Paralyzed!/g, '⚡ Thunder Attack: TURA! $1 felç oldu!');
  s = s.replace(/⚡ Thunder Attack: TAILS! Dark Jolteon dealt 10 damage to itself!/g, '⚡ Thunder Attack: YAZI! Dark Jolteon kendine 10 hasar verdi!');
  s = s.replace(/⚡ Stomp: HEADS! \+10 damage \(30 damage total\)!/g, '⚡ Stomp: TURA! +10 hasar (Toplam 30 hasar)!');
  s = s.replace(/⚡ Quick Attack: HEADS! \+20 damage \((.*?) damage total\)!/g, '⚡ Quick Attack: TURA! +20 hasar (Toplam $1 hasar)!');
  s = s.replace(/💢 Rampage dealt (.*?) damage \(\+(.*?) from damage taken\)!/g, '💢 Rampage $1 hasar verdi (Alınan hasardan +$2)!');
  s = s.replace(/😵 Rampage: TAILS! Tauros became Confused!/g, '😵 Rampage: YAZI! Tauros kafa karışıklığına (Confusion) uğradı!');

  s = s.replace(/🌋 Earthquake dealt 10 damage to each benched Pokémon on (.*?)'s side!/g, '🌋 Earthquake, $1 tarafındaki tüm yedek Pokémonlara 10 hasar verdi!');
  s = s.replace(/💥 Selfdestruct exploded! 10 damage to all benched Pokémon, 40 to (.*?)!/g, '💥 Selfdestruct patladı! Tüm yedeklere 10 hasar, $1 Pokémonuna 40 hasar!');
  s = s.replace(/👻 Gastly formed a Destiny Bond! If knocked out next turn, the attacker is knocked out too!/g, '👻 Gastly Destiny Bond kurdu! Gelecek tur bayılırsa saldıran da bayılacak!');
  s = s.replace(/👻 Destiny Bond activated! (.*?) is Knocked Out along with (.*?)!/g, '👻 Destiny Bond etkinleşti! $1, $2 ile birlikte bayıldı!');

  s = s.replace(/▲ (.*?) used Pokémon Breeder! Evolved (.*?) directly into (.*?)! \(Status cured, HP: (.*?)\)/g, '▲ $1 Pokémon Breeder kullandı! $2 doğrudan $3 Pokémonuna evrimleşti! (HP: $4)');
  s = s.replace(/(.*?) retrieved (\d+) Energy cards from discard pile\./g, '$1 ıskarta yığınından $2 Energy kartı geri aldı.');
  s = s.replace(/(.*?) used Super Energy Removal and discarded (\d+) opponent Energy cards!/g, '$1 Super Energy Removal kullandı ve rakibin $2 Energy kartını ıskartaya attı!');
  s = s.replace(/(.*?) used Maintenance, shuffled 2 cards and drew 1 card\./g, '$1 Maintenance kullandı, 2 kartı desteye karıp 1 kart çekti.');
  s = s.replace(/(.*?) used Lass! All Trainer cards in both hands were shuffled into decks\./g, '$1 Lass kullandı! Her iki oyuncunun elindeki tüm Trainer kartları destelerine karıldı.');
  s = s.replace(/(.*?) revived (.*?) to the bench!/g, '$1, $2 kartını ıskarta yığınından yedeğe canlandırdı!');
  s = s.replace(/(.*?) scooped up (.*?) back to hand\./g, '$1, $2 kartını eline geri topladı.');
  s = s.replace(/(.*?) devolved (.*?) with Devolution Spray!/g, '$1, Devolution Spray ile $2 kartını bir önceki evresine düşürdü!');

  s = s.replace(/Welcome to the 1999 Pokémon TCG Arena!/g, '1999 Pokémon TCG Arenasına Hoş Geldiniz!');
  s = s.replace(/Each player drew 7 cards and placed (\d+) Prize Cards\./g, 'Her oyuncu 7 kart çekti ve $1 Ödül Kartı yerleştirdi.');
  s = s.replace(/Multiplayer Match Started!/g, 'Çok Oyunculu Maç Başladı!');
  s = s.replace(/--- Turn (\d+): (.*?)'s Turn ---/g, '--- $1. Tur: $2 Sırası ---');
  s = s.replace(/--- Turn (\d+): Your Turn ---/g, '--- $1. Tur: Sizin Sıranız ---');
  s = s.replace(/--- Turn 1: Your Turn ---/g, '--- 1. Tur: Sizin Sıranız ---');
  s = s.replace(/You placed (.*?) as your Active Pokémon\./g, '$1 kartını Aktif olarak sahaya sürdünüz.');
  s = s.replace(/(?:Oyuncu|Player) placed (.*?) as Active Pokémon\./g, 'Oyuncu, $1 kartını Aktif olarak yerleştirdi.');
  s = s.replace(/(.*?) placed (.*?) as Active Pokémon\./g, '$1, $2 kartını Aktif olarak yerleştirdi.');
  s = s.replace(/(.*?) put (.*?) on the bench\./g, '$1, $2 kartını yedeğe koydu.');
  s = s.replace(/(.*?) attached (.*?) to (.*?)\./g, '$1, $3 üzerine $2 ekledi.');
  s = s.replace(/▲ (.*?) evolved (.*?) into (.*?)! \(Status cured, HP: (.*?)\)/g, '▲ $1, $2 evrimleştirip $3 yaptı! (HP: $4)');
  s = s.replace(/🔄 (.*?) retreated (.*?) and sent out (.*?)!/g, '🔄 $1, $2 geri çekip $3 sahaya sürdü!');
  s = s.replace(/(.*?) sent out (.*?) from the bench!/g, '$1, yedekten $2 sahaya sürdü!');
  s = s.replace(/✨ (.*?) played Trainer card: (.*?)!/g, '✨ $1, $2 Trainer kartını oynadı!');
  s = s.replace(/(.*?) drew 2 cards with Bill\./g, '$1, Bill ile 2 kart çekti.');
  s = s.replace(/(.*?) drew a card \((\d+) in hand, (\d+) in deck\)\./g, '$1 bir kart çekti ($2 elde, $3 destede).');
  s = s.replace(/(.*?) discarded hand and drew 7 cards with Professor Oak\./g, '$1, elini atıp Professor Oak ile 7 yeni kart çekti.');
  s = s.replace(/(.*?) recovered (\d+) HP with Potion \((.*?)\)!/g, '$1, Potion ile $2 HP kazandı ($3)!');
  s = s.replace(/(.*?) was healed of all status conditions!/g, '$1 üzerindeki tüm status etkileri iyileşti!');
  s = s.replace(/(.*?) discarded 1 Energy and recovered (\d+) HP!/g, '$1, 1 Energy atıp $2 HP kazandı!');
  s = s.replace(/Attached PlusPower to (.*?) \(\+10 attack damage this turn\)!/g, '$1 üzerine PlusPower eklendi (bu tur +10 hasar)!');
  s = s.replace(/Attached Defender to (.*?) \(-20 damage received next turn\)!/g, '$1 üzerine Defender eklendi (gelecek tur -20 hasar)!');
  s = s.replace(/💨 Gust of Wind forced (.*?)'s (.*?) into the Active position!/g, '💨 Gust of Wind ile $1 tarafının $2 Aktif konuma çekildi!');
  s = s.replace(/Energy Removal: Discarded 1 (.*?) from (.*?)'s (.*?)(?:!|\.)/g, '⚡ Energy Removal: $2 tarafının $3 Pokémonundan 1 $1 ıskartaya atıldı!');
  s = s.replace(/Super Energy Removal: Removed Energy from both sides!/g, '⚡ Super Energy Removal: Her iki taraftan Enerji kartları ıskartaya atıldı!');
  s = s.replace(/⚡ Opponent played Energy Removal to remove your Energy!/g, '⚡ Rakip, Enerjinizi sökmek için Energy Removal kartı oynadı!');
  s = s.replace(/⚡ Opponent played Super Energy Removal to remove your Energy!/g, '⚡ Rakip, Super Energy Removal kartı oynadı!');
  s = s.replace(/(.*?)'s (.*?) lost 1 Energy card!/g, '1 Energy kaybedildi!');

  s = s.replace(/⚔️ (?:Oyuncu|Player)'s (.*?) used (.*?) for (\d+) damage! \((.*?) remaining\)/g, '⚔️ $1, $2 saldırısıyla $3 hasar verdi! (Kalan: $4)');
  s = s.replace(/⚔️ (.*?)'s (.*?) used (.*?) for (\d+) damage! \((.*?) remaining\)/g, (_, player, name, atk, dmg, rem) => `⚔️ ${player} tarafının ${getTurkishPossessive(name)}, ${atk} saldırısıyla ${dmg} hasar verdi! (Kalan: ${rem})`);
  s = s.replace(/💀 (.*?) was Knocked Out!/g, '💀 $1 Bayıldı!');
  s = s.replace(/🎁 (?:Oyuncu|Player) drew 1 Prize Card \((.*?) remaining\)! \[Obtained (.*?)\]/g, '🎁 1 Ödül Kartı aldınız (Kalan: $1)! [$2 kazanıldı]');
  s = s.replace(/🎁 (.*?) drew 1 Prize Card \((.*?) remaining\)! \[Obtained (.*?)\]/g, '🎁 $1, 1 Ödül Kartı aldı (Kalan: $2)! [$3 kazanıldı]');
  s = s.replace(/🎁 (.*?) drew 1 Prize Card \((.*?) remaining\)!/g, '🎁 $1, 1 Ödül Kartı aldı (Kalan: $2)!');
  s = s.replace(/Not enough energy to use (.*?)!/g, '$1 saldırısını kullanmak için yetersiz Energy!');

  // 5. Status conditions & Coin flips
  s = s.replace(/Coin flip: TAILS! (.*?) avoided Confusion\./g, 'Yazı-Tura: YAZI! $1 kafa karışıklığına uğramadı (Confusion etkisi tutmadı).');
  s = s.replace(/Coin flip: TAILS! (.*?) avoided Poison\./g, 'Yazı-Tura: YAZI! $1 zehirlenmedi (Poison etkisi tutmadı).');
  s = s.replace(/Coin flip: TAILS! (.*?) avoided Sleep\./g, 'Yazı-Tura: YAZI! $1 uyumadı (Sleep etkisi tutmadı).');
  s = s.replace(/Coin flip: TAILS! (.*?) avoided Paralysis\./g, 'Yazı-Tura: YAZI! $1 felç olmadı (Paralysis etkisi tutmadı).');

  s = s.replace(/Flipped 2 coins: (\d+) HEADS \((\d+) damage\)!/g, '2 adet Yazı-Tura atıldı: $1 TURA ($2 hasar)!');
  s = s.replace(/Flipped (\d+) coins: (\d+) HEADS/g, '$1 adet Yazı-Tura atıldı: $2 TURA');
  s = s.replace(/Coin flip: HEADS!/g, 'Yazı-Tura: TURA!');
  s = s.replace(/Coin flip: TAILS!/g, 'Yazı-Tura: YAZI!');
  s = s.replace(/⚡ Coin flip: HEADS!/g, '⚡ Yazı-Tura: TURA!');
  s = s.replace(/⚡ Coin flip: TAILS!/g, '⚡ Yazı-Tura: YAZI!');
  s = s.replace(/☠️ Coin flip: HEADS!/g, '☠️ Yazı-Tura: TURA!');
  s = s.replace(/💤 Coin flip: HEADS!/g, '💤 Yazı-Tura: TURA!');
  s = s.replace(/💤 Coin flip: TAILS!/g, '💤 Yazı-Tura: YAZI!');
  s = s.replace(/😵 Coin flip: HEADS!/g, '😵 Yazı-Tura: TURA!');
  s = s.replace(/😵 Coin flip: TAILS!/g, '😵 Yazı-Tura: YAZI!');
  s = s.replace(/⚡ Thunderpunch check: HEADS! \+10 damage/g, '⚡ Thunderpunch kontrolü: TURA! +10 hasar');
  s = s.replace(/⚡ Thunderpunch check: TAILS!/g, '⚡ Thunderpunch kontrolü: YAZI!');
  s = s.replace(/⚡ Thunder Jolt recoil: TAILS!/g, '⚡ Thunder Jolt geri tepmesi: YAZI!');
  s = s.replace(/⚡ Thunder recoil: TAILS!/g, '⚡ Thunder geri tepmesi: YAZI!');
  s = s.replace(/⚡ Electric Shock recoil: TAILS!/g, '⚡ Electric Shock geri tepmesi: YAZI!');

  s = s.replace(/⚡ Coin flip: HEADS! (.*?) is now Paralyzed \(Cannot attack or retreat next turn\)!/g, '⚡ Yazı-Tura: TURA! $1 artık Paralysis (Felç) durumunda!');
  s = s.replace(/⚡ Coin flip: HEADS! (.*?) is now Paralyzed!/g, '⚡ Yazı-Tura: TURA! $1 artık Paralysis (Felç) durumunda!');
  s = s.replace(/⚡ (.*?) is now Paralyzed!/g, '⚡ $1 artık Paralysis (Felç) durumunda!');
  s = s.replace(/💤 Coin flip: HEADS! (.*?) is now Asleep!/g, '💤 Yazı-Tura: TURA! $1 artık Sleep (Uyku) durumunda!');
  s = s.replace(/💤 (.*?) is now Asleep!/g, '💤 $1 artık Sleep (Uyku) durumunda!');
  s = s.replace(/💤 (.*?) is Asleep and cannot attack!/g, '💤 $1 Sleep durumunda ve saldıramaz!');
  s = s.replace(/⚡ (.*?) is Paralyzed and cannot attack!/g, '⚡ $1 Paralysis durumunda ve saldıramaz!');
  s = s.replace(/💤 (.*?) woke up!/g, '💤 $1 uyandı!');
  s = s.replace(/💤 (.*?) is still asleep\./g, '💤 $1 hala uyuyor.');
  s = s.replace(/😵 Coin flip: HEADS! (.*?) is now Confused!/g, '😵 Yazı-Tura: TURA! $1 artık Confused (Kafa Karışıklığı) durumunda!');
  s = s.replace(/😵 (.*?) is now Confused!/g, '😵 $1 artık Confused (Kafa Karışıklığı) durumunda!');
  s = s.replace(/😵 Confusion check: HEADS! (.*?) overcame confusion\./g, '😵 Confusion kontrolü: TURA! $1 saldırıyı başarıyla yaptı.');
  s = s.replace(/😵 Confusion check: TAILS! (.*?) hurt itself in confusion for 20 damage \((.*?)\)!/g, '😵 Confusion kontrolü: YAZI! $1 kendine 20 hasar vurdu ($2)!');
  s = s.replace(/☠️ (.*?) is now Poisoned!/g, '☠️ $1 artık Poisoned (Zehirlendi) durumunda!');
  s = s.replace(/☠️ (.*?) is badly Poisoned \(Takes 20 damage between turns\)!/g, '☠️ $1 Toxic durumunda (Tur aralarında 20 hasar alır)!');
  s = s.replace(/💥 Weakness triggered! \((.*?) x2\) -> (\d+) damage!/g, '💥 Weakness tetiklendi! ($1 x2) -> $2 hasar!');
  s = s.replace(/🛡️ Resistance triggered! \((.*?) -30\) -> (\d+) damage!/g, '🛡️ Resistance tetiklendi! ($1 -30) -> $2 hasar!');

  // Generic subjects
  s = s.replace(/\bOpponent \(Gary\)\b/g, 'Gary (Rakip)');
  s = s.replace(/\bOpponent\b/g, 'Rakip');
  s = s.replace(/\bPlayer\b/g, 'Oyuncu');

  return s;
}
