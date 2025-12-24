(function() {
  // --- 初期設定 ---

  // ページの読み込み時に一度だけ、隠す設定ならCSSクラスを適用
  chrome.storage.local.get(['rubyHidden'], (result) => {
    if (result.rubyHidden) {
      document.documentElement.classList.add('ruby-hidden');
    }
  });

  // ストレージの変更を監視するリスナー
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.rubyHidden) {
      if (changes.rubyHidden.newValue) {
        document.documentElement.classList.add('ruby-hidden');
      } else {
        document.documentElement.classList.remove('ruby-hidden');
      }
      
      const button = document.querySelector('#ruby-toggle-switch-container button');
      if (button) {
        const isRubyOn = !changes.rubyHidden.newValue;
        button.setAttribute('aria-pressed', isRubyOn);
      }
    }
  });

  /**
   * URLをチェックし、条件に合致すればスイッチ追加処理を実行するメイン関数
   */
  function mainLogic() {
    const href = window.location.href;
    const isScripturePage = href.includes('/scriptures/') && href.includes('lang=jpn');
    const existingSwitch = document.getElementById('ruby-toggle-switch-container');

    if (!isScripturePage) {
      if (existingSwitch) {
        existingSwitch.remove();
      }
      return;
    }

    const panelContent = document.querySelector('[data-testid="theme-panel-content"]');
    if (!panelContent || panelContent.querySelector('#ruby-toggle-switch-container')) {
      return;
    }

    const footnotesLabel = panelContent.querySelector('[data-testid="footnotes-menu-label"]');
    if (footnotesLabel && footnotesLabel.parentElement) {
      const targetElement = footnotesLabel.parentElement;

      const switchContainer = document.createElement('label');
      switchContainer.id = 'ruby-toggle-switch-container';
      switchContainer.className = targetElement.className; 

      const containerDiv = document.createElement('div');
      const label = document.createElement('div');
      label.textContent = 'ふりがなを表示する';
      label.className = 'sc-1u44evz-0 kSjRrh';

      const button = document.createElement('button');
      button.className= 'sc-1v62o0r-0 fkIenf sc-1bldwon-1 eIpYBa';

      const slidebutton = document.createElement('span');
      slidebutton.className = 'sc-1bldwon-0 bQIPYw';

      button.appendChild(slidebutton);
      containerDiv.appendChild(label);
      containerDiv.appendChild(button);
      switchContainer.appendChild(containerDiv);

      switchContainer.addEventListener('click', (event) => {
        event.preventDefault();
        chrome.storage.local.get(['rubyHidden'], (result) => {
          chrome.storage.local.set({ rubyHidden: !result.rubyHidden });
        });
      });

      chrome.storage.local.get(['rubyHidden'], (result) => {
        const isRubyOn = !result.rubyHidden;
        button.setAttribute('aria-pressed', isRubyOn);
        targetElement.after(switchContainer);
      });
    }
  }

  // --- 実行 ---
  // 1. 初期ページの状態で一度実行
  mainLogic();

  // 2. SPAによるページ遷移を監視するため、Observerを開始
  const observer = new MutationObserver(mainLogic);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
