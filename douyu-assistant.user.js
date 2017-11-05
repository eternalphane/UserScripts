// ==UserScript==
// @name         斗鱼助手
// @namespace    https://gist.github.com/EternalPhane/
// @version      0.2
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
    function getyw() {
        var time = $("span.getyw-time").text(),
            second = 1;
        if (time == "领取" && !$("div.v3-sign-wrap:visible").length) {
            $("div.geetest_btn").click();
        } else if (time == "完成") {
            return;
        } else if (time != "") {
            time = time.split(":");
            second = parseInt(time[0]) * 60 + parseInt(time[1]);
        }
        yuwanId = setTimeout(getyw, second);
    }
    $("input#chest-switch").change(function() {
        if (this.checked) {
            chestId = setInterval(function() {
                var peck = $("div.peck-cdn");
                if (peck.text() == "领取") {
                    peck.click();
                }
            }, 500);
        } else {
            clearInterval(chestId);
        }
    });
    $("input#yuwan-switch").change(function() {
        if (this.checked) {
            getyw();
        } else {
            clearTimeout(yuwanId);
        }
    });
})();