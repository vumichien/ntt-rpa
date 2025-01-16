document.addEventListener('DOMContentLoaded', () => {
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const flowchartSvg = document.querySelector('.flowchart-container svg');
    const blackBox = flowchartSvg.querySelector('rect[fill="none"]'); // BlackBox

    // ページにアクセスしたときにデフォルトメッセージを表示
    appendChatbotMessage('どの操作を修正したいですか？');

    // コンテンツに基づいて送信ボタンの状態を更新
    userInput.addEventListener('input', () => {
        adjustTextareaHeight(userInput);
        sendButton.disabled = !userInput.value.trim();
        sendButton.classList.toggle('active', !!userInput.value.trim());
    });

    // keydownイベントをリッスン
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // メッセージ送信イベント
    sendButton.addEventListener('click', sendMessage);

    // textareaの高さを調整
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    // メッセージを送信
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendUserMessage(message);
        userInput.value = '';
        sendButton.disabled = true;
        sendButton.classList.remove('active');

        // チャットボットからの応答を処理
        handleChatbotResponse(message);
    }

    // ユーザーメッセージを表示
    function appendUserMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container user-message-container';

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = '/static/flowchart/images/user-avatar.png';
        avatar.alt = 'User Avatar';

        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.textContent = message;

        messageContainer.appendChild(messageDiv);
        messageContainer.appendChild(avatar);
        chatOutput.appendChild(messageContainer);
        scrollToBottom();
    }

    // チャットボットメッセージを表示
    function appendChatbotMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container chatbot-message-container';

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = '/static/flowchart/images/chatbot-avatar.png';
        avatar.alt = 'Chatbot Avatar';

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message';
        messageDiv.textContent = message;

        messageContainer.appendChild(avatar);
        messageContainer.appendChild(messageDiv);
        chatOutput.appendChild(messageContainer);
        scrollToBottom();
    }

    // チャットボットの「考え中」インジケーターを表示
    function showThinkingIndicator() {
        const thinkingIndicator = document.createElement('div');
        thinkingIndicator.className = 'message-container chatbot-message-container thinking-indicator';
        thinkingIndicator.innerHTML = `
            <img src="/static/flowchart/images/chatbot-avatar.png" alt="Chatbot Avatar" class="avatar">
            <div class="chatbot-message">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>`;
        chatOutput.appendChild(thinkingIndicator);
        scrollToBottom();
        return thinkingIndicator;
    }

    // ダイアログの最後までスクロール
    function scrollToBottom() {
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    // チャットボットからの応答を処理
    function handleChatbotResponse(userMessage) {
        const thinkingIndicator = showThinkingIndicator();

        setTimeout(() => {
            thinkingIndicator.remove();

            if (userMessage.includes('システム起動とパスワード入力の接続を削除し、ID入力をパスワード入力に接続するように修正します')) {
                updateFlowchartStep1();
                appendChatbotMessage('修正しました。他に修正したい点はありますか？');
            } else if (userMessage.includes('パスワード入力をパスワード再入力に接続し、ID存在チェックを追加し、ID存在チェック3とパスワード再入力をログインクリックに接続します')) {
                updateFlowchartStep2();
                appendChatbotMessage('修正しました。他に修正したい点はありますか？');
            } else if (userMessage.includes('大丈夫だと思います')) {
                appendChatbotMessageWithDownload();
            } else {
                appendChatbotMessage('すみません、そのリクエストはサポートされていません。');
            }
        }, 1500);
    }

    // フローチャートのステップ1を更新
    function updateFlowchartStep1() {
        const polylineToRemove = flowchartSvg.querySelector('polyline[points="260,145 360,145 360,200"]');
        if (polylineToRemove) polylineToRemove.remove();

        const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine.setAttribute('x1', '260');
        newLine.setAttribute('y1', '225');
        newLine.setAttribute('x2', '300');
        newLine.setAttribute('y2', '225');
        newLine.setAttribute('stroke', '#0d6efd');
        newLine.setAttribute('stroke-width', '2');
        newLine.setAttribute('marker-end', 'url(#arrowhead)');
        flowchartSvg.appendChild(newLine);
    }

    // フローチャートのステップ2を更新
   function updateFlowchartStep2() {
        const polylineToRemove = flowchartSvg.querySelector('polyline[points="360,250 360,305 260,305"]');
        if (polylineToRemove) polylineToRemove.remove();

        // ラベルの名前を「ログインをクリック」から「ID存在チェック」に変更
        const textToUpdate = flowchartSvg.querySelector('text[x="200"][y="310"]');
        if (textToUpdate) {
            textToUpdate.textContent = 'ID存在チェック';
        }
        // パスワードを再入力を追加
        const operation5 = createNode(300, 280, 'パスワードを再入力', '#C1E5F5');
        flowchartSvg.appendChild(operation5.node);
        flowchartSvg.appendChild(operation5.text);

        // ログインをクリックを追加
        const operation6 = createNode(220, 390, 'ログインをクリック', '#C1E5F5');
        flowchartSvg.appendChild(operation6.node);
        flowchartSvg.appendChild(operation6.text);

        // パスワード入力からパスワード再入力までの線を追加
        flowchartSvg.appendChild(createLine(360, 250, 360, 280));

        // ID存在チェックとパスワード再入力から下に伸びる2本の線を作成
        flowchartSvg.appendChild(createLineNoMarker(200, 330, 200, 350));
        flowchartSvg.appendChild(createLineNoMarker(360, 330, 360, 350));

        // ID存在チェックとパスワード再入力を接続する水平線を作成
        flowchartSvg.appendChild(createLineNoMarker(200, 350, 360, 350));

        // ID存在チェックとパスワード再入力を接続する点からログインをクリックまでの垂直線を作成
        flowchartSvg.appendChild(createLine(280, 350, 280, 390));

        // 必要に応じてblackboxを拡張
        resizeBlackBox(100, 90);
    }

    // ノード（rectとtext）を作成
    function createNode(x, y, label, color) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', 120);
        rect.setAttribute('height', 50);
        rect.setAttribute('rx', 10);
        rect.setAttribute('fill', color);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + 60);
        text.setAttribute('y', y + 30);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', 14);
        text.setAttribute('fill', 'black');
        text.textContent = label;

        return { node: rect, text: text };
    }

    // 線を作成
    function createLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#0d6efd');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        return line;
    }

      function createLineNoMarker(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#0d6efd');
        line.setAttribute('stroke-width', '2');
        return line;
    }

    // ポリラインを作成
    function createPolyline(points) {
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', '#0d6efd');
        polyline.setAttribute('stroke-width', '2');
        polyline.setAttribute('marker-end', 'url(#arrowhead)');
        return polyline;
    }

    // blackboxを拡張
   function resizeBlackBox(addWidth, addHeight) {
        const currentWidth = parseInt(blackBox.getAttribute('width'));
        const currentHeight = parseInt(blackBox.getAttribute('height'));

        // blackboxのサイズを更新
        blackBox.setAttribute('width', currentWidth + addWidth);
        blackBox.setAttribute('height', currentHeight + addHeight);

        // ノード完了とblackboxから完了への線を見つける
        const completeNode = flowchartSvg.querySelector('rect[x="140"][y="410"]'); // ノード完了
        const completeText = flowchartSvg.querySelector('text[x="200"][y="440"]'); // テキスト完了
        const lineToComplete = flowchartSvg.querySelector('line[x1="200"][y1="360"][x2="200"][y2="410"]'); // 接続線

        // ノード完了とテキスト完了の位置を更新
        const newY = parseInt(completeNode.getAttribute('y')) + addHeight;
        completeNode.setAttribute('y', newY);
        completeText.setAttribute('y', newY + 30);

        // 接続線の位置を更新
        lineToComplete.setAttribute('y1', parseInt(lineToComplete.getAttribute('y1')) + addHeight);
        lineToComplete.setAttribute('y2', parseInt(lineToComplete.getAttribute('y2')) + addHeight);
    }

    function appendChatbotMessageWithDownload() {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container chatbot-message-container';

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = '/static/flowchart/images/chatbot-avatar.png';
        avatar.alt = 'Chatbot Avatar';

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message';
        messageDiv.textContent = 'ご確認いただきありがとうございます。以下のリンクから新しいシナリオをダウンロードできます';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn btn-primary';
        downloadButton.textContent = 'ダウンロード';
        downloadButton.addEventListener('click', downloadSVG);

        buttonContainer.appendChild(downloadButton);
        messageContainer.appendChild(avatar);
        messageContainer.appendChild(messageDiv);
        chatOutput.appendChild(messageContainer);
        chatOutput.appendChild(buttonContainer);
        scrollToBottom();
    }

    function downloadSVG() {
        const svgElement = flowchartSvg.outerHTML; // SVGコンテンツを取得
        const blob = new Blob([svgElement], { type: 'image/svg+xml;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'scenario.svg'; // ダウンロード時のファイル名
        link.click();
    }

});
