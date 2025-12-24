// ページの読み込み時に設定を確認し、クラスを適用
chrome.storage.local.get(['rubyHidden'], (result) => {
  if (result.rubyHidden) {
    document.documentElement.classList.add('ruby-hidden');
  }
});

// ストレージの変更を監視し、クラスとスイッチの状態を動的に切り替え
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.rubyHidden) {
    // CSSクラスを更新
    if (changes.rubyHidden.newValue) {
      document.documentElement.classList.add('ruby-hidden');
    } else {
      document.documentElement.classList.remove('ruby-hidden');
    }
    
    // スイッチの表示も更新
    const button = document.querySelector('#ruby-toggle-switch-container button');
    if (button) {
      const isRubyOn = !changes.rubyHidden.newValue;
      button.setAttribute('aria-pressed', isRubyOn);
    }
  }
});

// MutationObserverでパネルヘッダーの出現を監視
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const panelContent = node.matches('[data-testid="theme-panel-content"]') ? node : node.querySelector('[data-testid="theme-panel-content"]');
        
        if (panelContent) {
          if (panelContent.querySelector('#ruby-toggle-switch-container')) {
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

            // ストレージから初期状態を取得し、属性を設定してからDOMに追加
            chrome.storage.local.get(['rubyHidden'], (result) => {
              const isRubyOn = !result.rubyHidden;
              button.setAttribute('aria-pressed', isRubyOn);
              
              // 属性設定後にDOMに追加
              targetElement.after(switchContainer);
            });

            return;
          }
        }
      }
    }
  }
});

// document.body が利用可能になってから監視を開始
if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
