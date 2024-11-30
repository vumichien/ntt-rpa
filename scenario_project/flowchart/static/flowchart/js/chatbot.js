document.addEventListener('DOMContentLoaded', () => {
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const flowchartSvg = document.querySelector('.flowchart-container svg');
    const blackBox = flowchartSvg.querySelector('rect[fill="none"]'); // BlackBox

    // Hiển thị tin nhắn mặc định khi vào trang
    appendChatbotMessage('どの操作を修正したいですか？');

    // Cập nhật trạng thái nút gửi dựa trên nội dung
    userInput.addEventListener('input', () => {
        adjustTextareaHeight(userInput);
        sendButton.disabled = !userInput.value.trim();
        sendButton.classList.toggle('active', !!userInput.value.trim());
    });

    // Lắng nghe sự kiện keydown
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Sự kiện click gửi tin nhắn
    sendButton.addEventListener('click', sendMessage);

    // Điều chỉnh chiều cao của textarea
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    // Gửi tin nhắn
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendUserMessage(message);
        userInput.value = '';
        sendButton.disabled = true;
        sendButton.classList.remove('active');

        // Xử lý phản hồi từ chatbot
        handleChatbotResponse(message);
    }

    // Hiển thị tin nhắn của người dùng
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

    // Hiển thị tin nhắn của chatbot
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

    // Hiển thị dấu hiệu "đang suy nghĩ" của chatbot
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

    // Cuộn xuống cuối hộp thoại
    function scrollToBottom() {
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    // Xử lý phản hồi từ chatbot
    function handleChatbotResponse(userMessage) {
        const thinkingIndicator = showThinkingIndicator();

        setTimeout(() => {
            thinkingIndicator.remove();

            if (userMessage.includes('操作1と操作4の接続を削除し、操作2を操作4に接続するように修正します')) {
                updateFlowchartStep1();
                appendChatbotMessage('修正しました。他に修正したい点はありますか？');
            } else if (userMessage.includes('操作4を操作5に接続し、操作3と操作5を操作6に接続します')) {
                updateFlowchartStep2();
                appendChatbotMessage('修正しました。他に修正したい点はありますか？');
            } else if (userMessage.includes('大丈夫だと思います')) {
                appendChatbotMessageWithDownload();
            } else {
                appendChatbotMessage('すみません、そのリクエストはサポートされていません。');
            }
        }, 1500);
    }

    // Cập nhật sơ đồ bước 1
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

    // Cập nhật sơ đồ bước 2
   function updateFlowchartStep2() {
        const polylineToRemove = flowchartSvg.querySelector('polyline[points="360,250 360,305 260,305"]');
        if (polylineToRemove) polylineToRemove.remove();
        // Thêm 操作5
        const operation5 = createNode(300, 280, '操作5', '#C1E5F5');
        flowchartSvg.appendChild(operation5.node);
        flowchartSvg.appendChild(operation5.text);

        // Thêm 操作6
        const operation6 = createNode(220, 390, '操作6', '#C1E5F5');
        flowchartSvg.appendChild(operation6.node);
        flowchartSvg.appendChild(operation6.text);

        // Thêm đường từ 操作4 đến 操作5
        flowchartSvg.appendChild(createLine(360, 250, 360, 280));

        // Tạo hai đường thẳng từ 操作3 và 操作5 đi xuống
        flowchartSvg.appendChild(createLineNoMarker(200, 330, 200, 350));
        flowchartSvg.appendChild(createLineNoMarker(360, 330, 360, 350));

        // Tạo đường ngang nối điểm từ 操作3 và 操作5
        flowchartSvg.appendChild(createLineNoMarker(200, 350, 360, 350));

        // Tạo đường thẳng từ điểm giữa (nối 操作3 và 操作5) xuống 操作6
        flowchartSvg.appendChild(createLine(280, 350, 280, 390));

        // Mở rộng blackbox nếu cần
        resizeBlackBox(100, 90);
    }

    // Tạo node (rect và text)
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

    // Tạo line
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

    // Tạo polyline
    function createPolyline(points) {
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', '#0d6efd');
        polyline.setAttribute('stroke-width', '2');
        polyline.setAttribute('marker-end', 'url(#arrowhead)');
        return polyline;
    }

    // Mở rộng blackbox
   function resizeBlackBox(addWidth, addHeight) {
        const currentWidth = parseInt(blackBox.getAttribute('width'));
        const currentHeight = parseInt(blackBox.getAttribute('height'));

        // Cập nhật kích thước của blackbox
        blackBox.setAttribute('width', currentWidth + addWidth);
        blackBox.setAttribute('height', currentHeight + addHeight);

        // Tìm node 完了 và đường nối từ blackbox đến 完了
        const completeNode = flowchartSvg.querySelector('rect[x="140"][y="410"]'); // Node 完了
        const completeText = flowchartSvg.querySelector('text[x="200"][y="440"]'); // Text 完了
        const lineToComplete = flowchartSvg.querySelector('line[x1="200"][y1="360"][x2="200"][y2="410"]'); // Line nối

        // Cập nhật vị trí của node 完了 và text 完了
        const newY = parseInt(completeNode.getAttribute('y')) + addHeight;
        completeNode.setAttribute('y', newY);
        completeText.setAttribute('y', newY + 30);

        // Cập nhật vị trí của line nối
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
        const svgElement = flowchartSvg.outerHTML; // Lấy nội dung SVG
        const blob = new Blob([svgElement], { type: 'image/svg+xml;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'scenario.svg'; // Tên tệp khi tải xuống
        link.click();
    }

});
