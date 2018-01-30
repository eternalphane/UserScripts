// ==UserScript==
// @name         StackOverflow净化器
// @namespace    https://gist.github.com/EternalPhane/
// @version      0.2
// @description  屏蔽某个智障用户Ciro Santilli
// @author       EternalPhane
// @include      /^https?:\/\/stackoverflow\.com\//
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        $('.user-info:contains(Ciro Santilli)').remove();
        $('.comment-user:contains(Ciro Santilli)').remove();
    });
})();