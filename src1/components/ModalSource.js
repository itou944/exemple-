import images from '../config/images';

const ModalSource = {
    ordinal: [
        ['Premier', 'First'],
        ['Deuxième', 'Second'],
        ['Troisième', 'Third'],
        ['Quatrième', 'Fourth'],
        ['Cinquième', 'Fifth'],
        ['Sixième', 'Sixth'],
        ['Septième', 'Seventh'],
        ['Huitième', 'Eighth'],
        ['Neuvième', 'Ninth'],
        ['Dixième', 'Tenth'],
        ['Onzième', 'Eleventh'],
        ['Douzième', 'Twelfth'],
        ['Treizième', 'Thirteenth'],
        ['Quatorzième', 'Fourteenth'],
        ['Quinzième', 'Fifteenth'],
        ['Seizième', 'Sixteenth'],
        ['Dix-septième', 'Seventeenth'],
        ['Dix-huitième', 'Eighteenth'],
        ['Dix-neuvième', 'Nineteenth'],
        ['Vingtième', 'Twentieth']
    ],
    months: [
        'Janv',
        'Févr',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sept',
        'Oct',
        'Nov',
        'Déc'
    ],
    languages: [
        'Allemand',
        'Anglais',
        'Chinois',
        'Espagnol',
        'Français',
        'Italien',
        'Japonais',
        'Néerlandais',
        'Portugais',
        'Russe',
    ],
    userHobbies: [
        'Courir',
        'Yoga',
        'Cuisiner',
        'Shopping',
        'Massage',
        'Architecture',
        'Design',
        'Couture',
        'Décoration',
        'Cinéma'
    ],
    childrenHobbies: [
        'Parc',
        'Manège',
        'Atelier de cuisine',
        'Karting',
        'Poneys',
        'Théâtre pour enfants',
        'Balançoires',
        'Football',
        'Basket',
        'Châteaux de sable',
        'Danse'
    ],
    languagesIcons: [
        [images.german, images.german],
        [images.english, images.english],
        [images.chinese, images.chinese],
        [images.spanish, images.spanish],
        [images.french, images.french],
        [images.italian, images.italian],
        [images.japanese, images.japanese],
        [images.deutch, images.deutch],
        [images.portugese, images.portugese],
        [images.russian, images.russian]
    ],
    userHobbiesIcons: [
        [images.cRunning, images.uRunning],
        [images.cYoga, images.uYoga],
        [images.cCooking, images.uCooking],
        [images.cShopping, images.uShopping],
        [images.cMassage, images.uMassage],
        [images.cArchitecture, images.uArchitecture],
        [images.cDesign, images.uDesign],
        [images.cCouture, images.uCouture],
        [images.cIntDesign, images.uIntDesign],
        [images.cCinema, images.uCinema],
    ],
    childrenHobbiesIcons: [
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
        [images.cBaby, images.uBaby],
    ],
    emailPattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

export { ModalSource };
