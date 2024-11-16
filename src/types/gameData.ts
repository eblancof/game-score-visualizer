export interface GameData {
    id: string;
    organizationId: string;
    competitionId: string;
    groupId: string;
    status: string;
    localTeamId: string;
    localScore: number | null;
    localBonus: number;
    localNotShowed: boolean;
    visitorTeamId: string;
    visitorScore: number | null;
    visitorBonus: number;
    visitorNotShowed: boolean;
    date: Date;
    round: number;
    stadiumId: string | null;
    statistics: any | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    competitionGameRugby: any | null;
    competitionGameOverride: any | null;
    competition: Competition;
    organization: GameDataOrganization;
    group: Group;
    stadium: any | null;
    localTeam: Team;
    visitorTeam: Team;
    hasPublications: boolean;
    section: string;
}

export interface Competition {
    id: string;
    organizationId: string;
    seasonId: string;
    ruleId: string;
    name: string;
    scraperName: string;
    minAge: number | null;
    maxAge: number | null;
    gender: string | null;
    showClassification: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    organization: CompetitionOrganization;
    rule: Rule;
}

export interface CompetitionOrganization {
    id: string;
    ownerClubId: string;
}

export interface Rule {
    has_bonus: boolean;
    notShowedScore: number;
    showedScore: number;
}

export interface Group {
    id: string;
    phaseId: string;
    title: string;
    scraperName: string;
    sportId: string;
    order: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    phase: Phase;
}

export interface Phase {
    title: string;
    type: string;
}

export interface Team {
    shieldUrl: string;
    id: string;
    name: string;
    editableName: string;
    febName: string;
    description: string | null;
    report: any | null;
    seasonId: string;
    clubId: string;
    imageId: string | null;
    order: string;
    visibility: boolean;
    imgType: string;
    imgAuxData: any | null;
    imgClubId: string | null;
    isFeatured: boolean;
    leveradeId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    leverade_id: string | null;
    teamClub: TeamClub | null;
    club: Club;
}

export interface Club {
    id: string;
    name: string;
    febName: string;
    editableName: string;
    postalCode: string | null;
    countryId: string | null;
    regionId: string | null;
    townId: string | null;
    contactId: string | null;
    seasonId: string;
    facebookUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    twitchUrl: string | null;
    tiktokUrl: string | null;
    youtubeUrl: string | null;
    clubUrl: string | null;
    customUrl: string | null;
    clupikUrl: string | null;
    wordpressUrl: string | null;
    clubCif: string | null;
    expeditionDate: Date | null;
    expeditionNumber: string | null;
    googleAnalytics: string | null;
    googleTagManager: string | null;
    type: string;
    appUrlIos: string | null;
    appUrlAndroid: string | null;
    clubParent: string | null;
    appStatus: boolean;
    seasonType: string;
    project: string;
    clubOwnerId: string | null;
    cancellation: boolean;
    redirect: string | null;
    status: string;
    digitalKit: boolean;
    leveradeClubId: string | null;
    leveradeFederationId: string | null;
    nextGeneration: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    ClubId: string | null;
    leverade_federation_id: string | null;
    contact: Contact | null;
    shieldUrl: string;
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    additionalData: any | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface TeamClub {
    id: string;
    clubId: string;
    teamId: string;
    visibility: boolean;
    order: string;
    customOrder: boolean;
    owner: boolean;
    sectionId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    ClubId: string;
    club_id: string;
    section_id: string;
    team_id: string;
}

export interface GameDataOrganization {
    id: string;
    name: string;
    type: string;
    ownerClubId: string;
    countryId: string;
    regionId: string;
    townId: string;
    url: string | null;
    sportId: string;
    showClassification: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}