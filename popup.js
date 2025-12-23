document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');

  // 保存された設定を読み込み、スイッチの状態を復元
  chrome.storage.local.get(['rubyHidden'], (result) => {
    toggleSwitch.checked = result.rubyHidden || false;
  });

  // スイッチの状態が変更されたときの処理
  toggleSwitch.addEventListener('change', () => {
    // 設定を保存
    chrome.storage.local.set({ rubyHidden: toggleSwitch.checked });
  });
});
