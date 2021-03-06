// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

// page container
frappe.provide('frappe.pages');
frappe.provide('frappe.views');

var cur_page = null;
frappe.views.Container = Class.extend({
	_intro: "Container contains pages inside `#container` and manages \
			page creation, switching",
	init: function() {
		this.container = $('#body_div').get(0);
		this.page = null; // current page
		this.pagewidth = $('#body_div').width();
		this.pagemargin = 50;

		var me = this;

		$(document).on("page-change", function() {
			// set data-route in body
			var route_str = frappe.get_route_str();
			$("body").attr("data-route", route_str);
			var has_sidebar = false;
			if(frappe.ui.pages[route_str] && !frappe.ui.pages[route_str].single_column) {
				has_sidebar = true;
			}
			$("body").attr("data-sidebar", has_sidebar ? 1 : 0);
		});

		$(document).bind('rename', function(event, dt, old_name, new_name) {
			frappe.breadcrumbs.rename(dt, old_name, new_name);
		});
	},
	add_page: function(label) {
		var page = $('<div class="content page-container"></div>')
			.attr('id', "page-" + label)
			.attr("data-page-route", label)
			.toggle(false)
			.appendTo(this.container).get(0);
		page.label = label;
		frappe.pages[label] = page;

		return page;
	},
	change_to: function(label) {
		cur_page = this;
		if(this.page && this.page.label === label) {
			$(this.page).trigger('show');
			return;
		}

		var me = this;
		if(label.tagName) {
			// if sent the div, get the table
			var page = label;
		} else {
			var page = frappe.pages[label];
		}
		if(!page) {
			console.log(__('Page not found')+ ': ' + label);
			return;
		}

		// hide dialog
		if(cur_dialog && cur_dialog.display && !cur_dialog.keep_open) {
			cur_dialog.hide();
		}

		// hide current
		if(this.page && this.page != page) {
			$(this.page).toggle(false);
			$(this.page).trigger('hide');
		}

		// show new
		if(!this.page || this.page != page) {
			this.page = page;
			// $(this.page).fadeIn(300);
			$(this.page).toggle(true);
		}

		$(document).trigger("page-change");

		this.page._route = window.location.hash;
		$(this.page).trigger('show');
		frappe.utils.scroll_to(0);
		frappe.breadcrumbs.update();

		return this.page;
	},
});


