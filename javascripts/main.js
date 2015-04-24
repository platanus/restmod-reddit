angular.module('reddit', ['restmod'])
.config(function(restmodProvider) {
	restmodProvider.rebase('BaseModel');
})
.run(function($rootScope) {

})

.factory('BaseModel', function(restmod) {
	return restmod.mixin({
		$extend: {
			'Model.unpack': function(_resource, _raw) {
				if(_raw.kind == 'Listing') {
					return _raw.data.children;
				} else {
					throw 'not implemented';
				}
			}
		}
	});
})
.factory('Item', function(restmod) {
    return restmod.model();
})
.factory('RedditRoot', function(restmod) {
	return restmod.model().mix({
		hot: {
			has_many: 'Item'
		}
	}).single('/');
});
