// ==UserScript==
// @name         斗鱼助手
// @namespace    https://gist.github.com/EternalPhane/
// @version      0.3.2
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
    GM_addStyle(GM_getResourceText('css'));
    $('div#js-stats-and-actions > div:nth-child(3)').after(GM_getResourceText('html'));
    var chestId = null,
        yuwanId = null;
    $('input#chest-switch').change(function() {
        if (this.checked) {
            chestId = setInterval(function() {
                var peck = $('div.peck-cdn');
                if (peck.length && '领取' === peck.text()) {
                    peck.click();
                }
            }, 100);
        } else {
            clearInterval(chestId);
        }
    });
    $('input#yuwan-switch').change(function() {
        if (this.checked) {
            (function getYuwan() {
                var time = $('span.getyw-time').text(),
                    ms = 1000;
                if ('领取' === time && !$('div.v3-sign-wrap:visible').length) {
                    $('a.may-btn').click();
                    setTimeout(function wait() {
                        if ($('div.geetest_wait').length) {
                            $('div.geetest_btn').click();
                            getYuwan();
                        } else {
                            setTimeout(wait, ms);
                        }
                    }, ms);
                    return;
                } else if ('完成' === time) {
                    return;
                } else if (time != '') {
                    time = time.split(':');
                    ms = parseInt(time[0]) * 60 + parseInt(time[1]) * 1000;
                }
                yuwanId = setTimeout(getYuwan, ms);
            })();
        } else {
            clearTimeout(yuwanId);
        }
    });
})();