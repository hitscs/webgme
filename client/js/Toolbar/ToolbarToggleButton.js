/*
 * Copyright (C) 2013 Vanderbilt University, All rights reserved.
 * 
 * Author: Robert Kereskenyi
 */

"use strict";

define(['./ButtonBase'], function (buttonBase) {

    var ToolbarToggleButton;

    ToolbarToggleButton = function (params) {
        var oClickFn = params.clickFn,
            toggleClickFn,
            btn;

        toggleClickFn = function (data) {
            btn.toggleClass('active');
            if (oClickFn) {
                oClickFn.call(this, data, btn.hasClass('active'));
            }
        };

        params.clickFn = toggleClickFn;
        btn = this._btn = buttonBase.createButton(params);

        this.el = $('<div class="toolbar-button"></div>');
        this.el.append(this._btn);
    };

    ToolbarToggleButton.prototype.setToggled = function (toggled) {
        this._btn.removeClass('active');
        if (toggled === true) {
            this._btn.addClass('active');
        }
    };


    return ToolbarToggleButton;
});