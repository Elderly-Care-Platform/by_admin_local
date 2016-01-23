var BY = BY || {};
BY.config = BY.config || {};
BY.config.regConfig = BY.config.regConfig || {};


BY.config.regConfig.userIdType = {
    'email': 0,
    'mobile': 1
}

BY.config.regConfig.formConfig = {
    "maxSecondaryPhoneNos": 3,
    "maxSecondaryEmailId": 2,
    "maxUserAddress": 20

}

BY.config.regConfig.userTypeConfig = {
    '-1': {
        'type': '-1',
        'contentPanel': 'app/components/signup/regUserType.html?versionTimeStamp=%PROJECT_VERSION%',
        'leftPanel': "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%",
        'controller': 'regUserTypeController',
        'category': 'NONE',
        'label': "I am",
        'showOrderHistory': true,
        'orderHistoryLabel': "Order history"
    },
    '0': {
        'type': '0',
        'contentPanel': 'app/components/signup/registration/individual/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%',
        'leftPanel': "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%",
        'controller': 'regIndividualCtrl',
        'category': 'CAREGIVER',
        'label': "About Me",
        'showOrderHistory': true,
        'orderHistoryLabel': "Order history"
    },
    '1': {
        'type': '1',
        'contentPanel': 'app/components/signup/registration/individual/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%',
        'leftPanel': "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%",
        'controller': 'regIndividualCtrl',
        'category': 'ELDER',
        'label': "About Me",
        'showOrderHistory': true,
        'orderHistoryLabel': "Order history"
    },
    '2': {
        'type': '2',
        'contentPanel': 'app/components/signup/registration/individual/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%',
        'leftPanel': "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%",
        'controller': 'regIndividualCtrl',
        'category': 'CURIOUS',
        'label': "About Me",
        'showOrderHistory': true,
        'orderHistoryLabel': "Order history"
    },
    '3': {
        'type': '3',
        'contentPanel': 'app/components/signup/registration/housing/regHousing.html?versionTimeStamp=%PROJECT_VERSION%',
        'leftPanel': "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%",
        'controller': 'regHousingCtrl',
        'category': 'HOUSING',
        'label': "Housing",
        'showOrderHistory': true,
        'orderHistoryLabel': "Order history"
    },
    '4': {
        'type': '4',
        'contentPanel': 'app/components/signup/registration/institution/regInstitution.html?versionTimeStamp=%PROJECT_VERSION%',
        'leftPanel': "app/components/signup/registration/institution/regInstLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%",
        'controller': 'regInstitutionCtrl',
        'category': 'SERVICES',
        'label': "Institution info",
        'showOrderHistory': true,
        'orderHistoryLabel': "Order history"
    },
    '5': {
        'type': '5',
        'contentPanel': '',
        'category': 'PRODUCTS',
        'label': ""
    },
    '6': {
        'type': '6',
        'contentPanel': '',
        'category': 'NGO',
        'label': ""
    },
    '7': {
        'type': '7',
        'contentPanel': 'app/components/signup/registration/professional/regProfessional.html?versionTimeStamp=%PROJECT_VERSION%',
        'leftPanel': "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%",
        'controller': 'regProfessionalCtrl',
        'category': 'PROFESSIONAL',
        'label': "Professional Info",
        'showOrderHistory': true,
        'orderHistoryLabel': "Order history"
    }
}


BY.config.regConfig.indvUserRegConfig = {
    'salutations': ["Ms.", "Mr.", "Dr.", "Prof."],

    'showGenderOptions': {
        "Dr.": ['0', '1'],
        "Prof.": ['0', '1'],
        "Ms.": [0],
        "Mr.": [1]
    },

    'gender': {
        '0': "Female",
        '1': "Male"
    },

    'occupation': ["Working", "Not Working", "Studying", "Retired"],


    'emotional_challenges1': ['Boredom',
        'Depression', 'Stress', 'Anxiety', 'Problematic Relationship'],

    'emotional_challenges2': ['Caregiver Burn-out',
        'Boredom',
        'Depression', 'Stress', 'Anxiety', 'Problematic Relationship'],

    'medical_issues': {
        'userType': [0, 1],
        'fetchFromMenu': "Elder's Health"
    },

    'hobbies': {
        'fetchFromMenu': "Active Leisure"
    },

    'countries': ["India"],

    'maritalStatus': ["married", "single", "divorced", "widowed"],

    'defaultAvatars': {
        '0': [{"reg": "img/profile/f-1.png", "detail": "img/profile/detail_f-1.png"},
            {"reg": "img/profile/f-2.png", "detail": "img/profile/detail_f-2.png"},
            {"reg": "img/profile/f-3.png", "detail": "img/profile/detail_f-3.png"}],

        '1': [{"reg": "img/profile/m-1.png", "detail": "img/profile/detail_m-1.png"},
            {"reg": "img/profile/m-2.png", "detail": "img/profile/detail_m-2.png"},
            {"reg": "img/profile/m-3.png", "detail": "img/profile/detail_m-3.png"}]
    }


}

BY.config.regConfig.housingConfig = {
    'fetchFromMenu': "Housing"
}

BY.config.regConfig.housingFacility = {
    'id': "",
    'userId': "",
    'name': "",
    'systemTags': [],
    'tier': "",
    'primaryAddress': {
        'city': "",
        'country': "",
        'locality': "",
        'streetAddress': "",
        'zip': ""
    },

    'facilityType': ["Luxury", "Moderate", "Basic", "Free"],
    'primaryPhoneNo': "",
    'secondaryPhoneNos': [],
    'primaryEmail': "",
    'secondaryEmails': [],
    'profileImage': null,
    'photoGalleryURLs': [],
    'shortDescription': "",
    'description': "",
    'status': 0,
    'reviewedBy': [],
    'ratedBy': [],
    'aggrRatingPercentage': 0,
    'isReviewedByUser': false,
    'isRatedByUser': false,
    'website': ""
};

BY.config.regConfig.institutionBranch = {
    "id": null,
    "userId": null,
    "userTypes": [8],
    "basicProfileInfo": {
        "firstName": null,
        "profileImage": null,
        "primaryEmail": null,
        "secondaryEmails": [],
        "primaryPhoneNo": null,
        "secondaryPhoneNos": [],
        "description": null,
        "photoGalleryURLs": [],
        "primaryUserAddress": {"streetAddress": null, "city": null, "zip": null, "locality": null, "country": null},
        "otherAddresses": [],
        "shortDescription": null
    },
    "individualInfo": {
        "salutation": null,
        "lastName": null,
        "gender": 0,
        "dob": null,
        "otherDates": null,
        "occupation": null,
        "emotionalIssues": null,
        "medicalIssues": null,
        "otherIssues": null,
        "maritalStatus": null,
        "hobbies": null,
        "otherHobbies": null,
        "interests": null,
        "otherInterests": null,
        "language": null
    },
    "serviceProviderInfo": {
        "services": [],
        "homeVisits": false,
        "website": null,
        "yearsExperience": 0,
        "incorporationDate": null,
        "specialities": null
    },
    "ratingPercentage": 0.0,
    "ratingCount": 0,
    "reviewCount": 0,
    "createdAt": null,
    "systemTags": [],
    "lastModifiedAt": null,
    "verified": false,
    "serviceBranches": [],
    "facilities": [],
    "reviewedByUser": false,
    "featured": false,
    "ratedByUser": false

};
