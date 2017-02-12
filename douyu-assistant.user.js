// ==UserScript==
// @name         斗鱼助手
// @namespace    https://gist.github.com/EternalPhane/
// @version      0.1
// @description  自动领取鱼丸（需要手动输入验证码）、自动打开宝箱
// @author       EternalPhane
// @include      /^https?:\/\/(www|yuxiu)\.douyu\.com\/\w+$/
// @resource     css https://gist.github.com/EternalPhane/e5f066bd9d4535ba56ea157dc15be084/raw/douyu-assistant.css
// @resource     html https://gist.github.com/EternalPhane/e5f066bd9d4535ba56ea157dc15be084/raw/douyu-assistant.html
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("css"));
    $("div#js-stats-and-actions > div:nth-child(3)").after(GM_getResourceText("html"));
    var chestId = null,
        yuwanId = null;
    $("input#chest-switch").change(function() {
        if (this.checked) {
            chestId = setInterval(function() {
                var peck = $(".pack");
                if (peck.css("style") == "block" && peck.hasClass("peck-open")) {
                    $(".peck-cdn").click();
                }
            }, 500);
        } else {
            clearInterval(chestId);
        }
    });
    $("input#yuwan-switch").change(function() {
        if (this.checked) {
            $("ul.cb-list span.may-get + a").click();
            yuwanId = setInterval(function() {
                var yw = $("ul.cb-list span.may-get + a");
                if (yw.length && !$("div.vcode9:visible").length) {
                    yw.click();
                }
            }, 60000);
        } else {
            clearInterval(yuwanId);
        }
    });
})();