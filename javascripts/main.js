angular.module('reddit', ['restmod'])
.config(function(restmodProvider) {
	restmodProvider.rebase('BaseModel');
})
.run(function($rootScope, RedditRoot) {
	$rootScope.hot = RedditRoot.hot.$fetch();
})

.factory('BaseModel', function(restmod) {
	return restmod.mixin({
		$extend: {
			'Model.unpack': function(_resource, _raw) {
				if(_raw.kind == 'Listing') {
					return _raw.data.children.map(function(child) {
						return child.data;
					});
				} else {
					throw 'not implemented';
				}
			}
		},
		$config: {
			urlPrefix: 'http://api.reddit.com'
		}
	});
})
.factory('Item', function(restmod) {
	return restmod.model().mix({
		$hook: {
			'after-feed': function() {
				if(this.is_self) {
					this.selftext = this.selftext;
				} else {
					this.selftext = this.url;
				}
			}
		}
	});
})
.factory('RedditRoot', function(restmod) {
	return restmod.model().mix({
		hot: {
			hasMany: 'Item'
		}
	}).single('/');
});
