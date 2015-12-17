var BY = BY || {};
BY.config = BY.config || {};
BY.config.regConfig = BY.config.regConfig || {};


BY.config.regConfig.regType = {
		'email' : '0',
		'mobile' : '1'
}

BY.config.regConfig.formConfig = {
    "maxSecondaryPhoneNos":3,
    "maxSecondaryEmailId":2,
    "maxUserAddress":20

}

BY.config.regConfig.userTypeConfig = {
    '-1' : {
        'type':'-1',
        'contentPanel':'views/signup/regUserType.html',
        'leftPanel' : "views/signup/registrationLeftPanel.html",
        'controller' : 'regUserTypeController',
        'category':'NONE',
        'label' : "I am"
    },
    '0' : {
        'type':'0',
        'contentPanel':'views/edit/editIndividual.html',
        'leftPanel' : "views/edit/editLeftPanel.html",
        'controller' : 'editIndividualCtrl',
        'category':'CAREGIVER',
        'label' : "About Me"
    },
    '1' : {
        'type':'1',
        'contentPanel':'views/signup/registration/regIndividual.html',
        'leftPanel' : "views/signup/registrationLeftPanel.html",
        'controller' : 'regIndividualCtrl',
        'category':'ELDER',
        'label' : "About Me"
    },
    '2' : {
        'type':'2',
        'contentPanel':'views/signup/registration/regIndividual.html',
        'leftPanel' : "views/signup/registrationLeftPanel.html",
        'controller' : 'regIndividualCtrl',
        'category':'CURIOUS',
        'label' : "About Me"
    },
    '3' : {
        'type':'3',
        'contentPanel':'views/signup/registration/regHousing.html',
        'leftPanel' : "views/signup/registrationLeftPanel.html",
        'controller' : 'regHousingCtrl',
        'category':'HOUSING',
        'label' : "Housing"
    },
    '4' : {
        'type':'4',
        'contentPanel':'views/edit/editInstitution.html',
        'leftPanel' : "views/edit/editInstitutionLeftPanel.html",
        'controller' : 'editInstitutionCtrl',
        'category':'SERVICES',
        'label' : "Institution info"
    },
    '5' : {
        'type':'5',
        'contentPanel':'',
        'category':'PRODUCTS',
        'label' : ""
    },
    '6' : {
        'type':'6',
        'contentPanel':'',
        'category':'NGO',
        'label' : ""
    },
    '7' : {
        'type':'7',
        'contentPanel':'views/edit/editProfessional.html',
        'leftPanel' : "views/edit/editLeftPanel.html",
        'controller' : 'editProfessionalCtrl',
        'category':'PROFESSIONAL',
        'label' : "Professional Info"
    },
    '8': {
    	'type': '8',
    	'contentPanel': 'views/edit/editInstitution.html',
        'leftPanel': 'views/edit/editInstitutionLeftPanel.html',
        'controller': 'editInstitutionCtrl',
        'category': 'SERVICE_BRANCH',
        'label': 'Branch Info'
    }
}


BY.config.regConfig.indvUserRegConfig = {
    'salutations' : ["Ms.", "Mr.", "Dr.","Prof."],

    'showGenderOptions' : {
        "Dr." : ['0', '1'],
        "Prof." : ['0', '1'],
        "Ms." : [0],
        "Mr." : [1]
    },

    'gender' : {
        '0' : "Female",
        '1' : "Male"
    },

    'occupation' : ["Working", "Not Working", "Studying", "Retired"],


    'emotional_challenges1' : ['Boredom',
                        'Depression','Stress', 'Anxiety', 'Problematic Relationship'],

    'emotional_challenges2' : ['Caregiver Burn-out',
        'Boredom',
        'Depression','Stress', 'Anxiety', 'Problematic Relationship'],

    'medical_issues' : {
        'userType' : [0, 1],
        'fetchFromMenu' : "Medical Conditions"
    },

    'hobbies' : {
        'fetchFromMenu' : "Activities"
    },

    'countries' : ["India"],
    
    'maritalStatus' : ["married", "single", "divorced", "widowed"],

    'defaultAvatars' : {
        '0' : [{"reg":"assets/img/profile/f-1.png","detail":"assets/img/profile/detail_f-1.png"},
            {"reg":"assets/img/profile/f-2.png", "detail":"assets/img/profile/detail_f-2.png"},
            {"reg":"assets/img/profile/f-3.png", "detail":"assets/img/profile/detail_f-3.png"}],

        '1' : [{"reg":"assets/img/profile/m-1.png","detail":"assets/img/profile/detail_m-1.png"},
            {"reg":"assets/img/profile/m-2.png", "detail":"assets/img/profile/detail_m-2.png"},
            {"reg":"assets/img/profile/m-3.png", "detail":"assets/img/profile/detail_m-3.png"}]
    }


}

BY.config.regConfig.housingConfig = {
    'fetchFromMenu' : "Housing"
}

BY.config.regConfig.housingFacility = {
		'id' : "",
		
		'userId' : "",
		
		'name' : "",
		
		'systemTags' : [],
		
		'tier' : "",
		
		'primaryAddress': {
			'city': "",
			'country': "",
			'locality': "",
			'streetAddress': "",
			'zip': ""
		},
		
		'facilityType' : ["Luxury", "Moderate", "Basic", "Free"],
		
		'primaryPhoneNo' : "",
		
		'secondaryPhoneNos' : [],
		
		'primaryEmail' : "",
		
		'secondaryEmails' : [],
		
		'profileImage': null,
		
		'photoGalleryURLs' : [],
		
		'shortDescription' : "",
		
		'description' : "",
		
		'status' : 0,
		
		'reviewedBy' : [],
		
		'ratedBy' : [],
		
		'aggrRatingPercentage' : 0,		
		
		'isReviewedByUser': false,
		
        'isRatedByUser' : false, 
        
        'website' : ""

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

