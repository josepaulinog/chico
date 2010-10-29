/**
 *	Tabs Navigator
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.TabNavigator = function(element, index){		
	var triggers = $(element).children(':first').find('a');	
	var content = $(element).children(':first').next();
	var instances = [];	
	
	// Global configuration
	triggers.addClass('uiTrigger');
	content.addClass('uiContent');
	
	// Starts (Mother is pregnant, and her children are born)
	$.each(triggers, function(i,e){
		instances.push(ui.Tab(i,e,index));
	});
	
	var show = function(event, tab){
		ui.instances.tabNavigator[index].tabs[tab].shoot(event);
	};
		
	return { show: function(event, tab){ show(event, tab) }, tabs:instances };
};



/*The potato is ready!!
$('h1').click(
	function(event){
	ui.instances.tabNavigator[0].show(event, 2);
});
*/

ui.Tab = function(index, element, parent){	
	var that = ui.Navigators(); // Inheritance		
	var display = element.href.split('#');
	
	that.conf = {
		name: 'tab',
		trigger: $(element),
		content: $(element).parents('.tabNavigator').find('#' + display[1])
	};
	
	that.conf.content.addClass('box');
	
	if(index == 0){
		that.status = true;
		$(element).addClass('on');
	};
	
	that.shoot = function(event){
		var tabs = ui.instances.tabNavigator[parent].tabs;		
		if(tabs[index].status) return;
		// Hide all my bro (because i'know who is my mamma)
		$.each(tabs, function(i, e){
			if(!e.status) return;
			e.hide(event, e.conf);
		});
		that.show(event, that.conf);
	};
	
	$(element).bind('click', that.shoot).addClass('uiTrigger');
		
	// Content
	that.conf.content.addClass('uiContent');
	if(!that.status) that.conf.content.hide(); // Hide all falses
	
	return that;
}
