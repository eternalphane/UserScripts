// ==UserScript==
// @name         斗鱼助手
// @namespace    https://gist.github.com/EternalPhane/
// @version      0.4
// @description  自动领取鱼丸（需要手动输入验证码）、自动打开宝箱
// @author       EternalPhane
// @include      /^https?:\/\/(www|yuxiu)\.douyu\.com\/(t\/)?\w+$/
// @resource     css https://gist.github.com/EternalPhane/e5f066bd9d4535ba56ea157dc15be084/raw/douyu-assistant.css
// @resource     html https://gist.github.com/EternalPhane/e5f066bd9d4535ba56ea157dc15be084/raw/douyu-assistant.html
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(() => {
    'use strict';
    GM_addStyle(GM_getResourceText('css'));
    $('div#js-stats-and-actions > div:nth-child(3)').after(GM_getResourceText('html'));
    let chestId = null;
    let yuwanId = null;
    const getYuwan = () => {
        const time = $('span.getyw-time').text();
        const wait = () => {
            if ($('div.aui_content').text()) {
                $('button.aui_state_highlight').click();
                $('input#yuwan-switch').click();
            } else if ($('div.geetest_wait').length) {
                $('div.geetest_btn')
                    .mouseenter()
                    .click();
                getYuwan();
            } else {
                setTimeout(wait, 100);
            }
        };
        switch (time) {
            case '领取':
                if ($('div.v3-sign-wrap:visible').length) {
                    break;
                }
                $('a.may-btn')
                    .mouseenter()
                    .click();
                setTimeout(wait, 100);
                return;
            case '完成':
                return;
            case '':
                break;
            default:
                const [minute, second] = time.split(':');
                const ms = (Number(minute) * 60 + Number(second)) * 1000;
                yuwanId = setTimeout(getYuwan, ms);
                return;
        }
        yuwanId = setTimeout(getYuwan, 1000);
    };
    $('input#chest-switch').change((e) => {
        e.currentTarget.checked
            ? (chestId = setInterval(() => {
                  if ($('div.geetest_fullpage_click_box:visible').length) {
                      return;
                  }
                  const peck = $('div.peck-cdn');
                  peck.length && '领取' === peck.text() && peck.mouseenter().click();
              }, 100))
            : clearInterval(chestId);
    });
    $('input#yuwan-switch').change(
        (e) => (e.currentTarget.checked ? getYuwan() : clearTimeout(yuwanId))
    );
})();
