// ページの読み込み時に設定を確認し、クラスを適用
chrome.storage.local.get(['rubyHidden'], (result) => {
  if (result.rubyHidden) {
    document.documentElement.classList.add('ruby-hidden');
  }
});

// ストレージの変更を監視し、クラスを動的に切り替え
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.rubyHidden) {
    if (changes.rubyHidden.newValue) {
      document.documentElement.classList.add('ruby-hidden');
    } else {
      document.documentElement.classList.remove('ruby-hidden');
    }
  }
});
