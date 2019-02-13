// ==UserScript==
// @name         StackOverflow净化器
// @namespace    https://github.com/EternalPhane/UserScripts/
// @version      0.2.2
// @description  屏蔽某个智障用户Ciro Santilli
// @author       EternalPhane
// @include      /^https?:\/\/(\w+\.)?stack(overflow|exchange)\.com\//
// @include      /^https?:\/\/(\w+\.)?askubuntu\.com\//
// ==/UserScript==

(() => {
    'use strict';
    $(() => {
        $('.user-info:contains(Ciro Santilli)').remove();
        $('.comment-user:contains(Ciro Santilli)').remove();
    });
})();
