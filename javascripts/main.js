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
				if(!angular.isArray(_raw)) _raw = [_raw];

				if(_resource.$isCollection) {
					var raw = [];
					angular.forEach(_raw, function(_item) {
						if(_item.kind == 'Listing') {
							angular.forEach(_item.data.children, function(child) {
								if(!_resource.$type.getProperty('redditType') || child.kind == _resource.$type.getProperty('redditType')) {
									raw.push(child.data);
								}
							});
						} else {
							throw 'not implemented';
						}
					});
					return raw;
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
.factory('Item', function(restmod,RMUtils) {
	return restmod.model().mix({
		comments: {
			hasMany: 'Comment',
			hooks: {
				'after-has-many-init': function() {
					this.$scope.$urlFor = function(_resource) {
						return RMUtils.joinUrl(this.$target.$url(), this.$scope.id);
					};
				}
			}
		},
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
.factory('Comment', function(restmod) {
	return restmod.model('/r/comments', {
		$config: {
			redditType: 't1'
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
