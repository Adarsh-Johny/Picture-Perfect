angular.module('eruditeApp.MockBackend', ['ngMockE2E', 'eruditeApp.Config'])
	.run(['$httpBackend', 'MOCK_CONFIG', function($httpBackend, MOCK_CONFIG) {
		$httpBackend.whenGET(/\/Templates\//).passThrough();
		$httpBackend.whenGET(/.*\.html/).passThrough();
		$httpBackend.whenGET(/\/mock-backend\//).passThrough();
		function containsUrl(url) {
			var isUrlMatch = false;
			if (MOCK_CONFIG.ignorePaths.length > 0) {
				for (var i in MOCK_CONFIG.ignorePaths) {
					isUrlMatch = isUrlMatch || url.indexOf(MOCK_CONFIG.ignorePaths[i]) > -1;
				}
			}
			return isUrlMatch;
		}

		$httpBackend.whenGET(containsUrl).passThrough();
		$httpBackend.whenPOST(containsUrl).passThrough();


		var mocks = eruditeMock.mockFunctions || false;
		if (mocks) {
			for (var i in mocks) {
				mocks[i]($httpBackend);
			}
		}

	}]);