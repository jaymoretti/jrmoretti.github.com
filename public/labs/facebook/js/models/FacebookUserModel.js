define(function(){
	var instance = null
	function FacebookUserModel(){
		
	};
	function getInstance(){ 
		if(instance === null){
			return new FacebookUserModel();
		} else {
			return instance;
		}
	}
	return getInstance();
});