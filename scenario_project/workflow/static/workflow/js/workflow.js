document.addEventListener('DOMContentLoaded', function() {
    // Auto expand textarea
    document.querySelectorAll('.auto-expand').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Khởi tạo chiều cao ban đầu
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    });
});

function typeText(text, index, callback, elementId = "typing-text") {
    const typingElement = document.getElementById(elementId);
    if (index < text.length) {
        // Xử lý đặc biệt cho các dòng bắt đầu bằng "-"
        let currentText = text.substring(0, index + 1);
        currentText = currentText.replace(/^-(.+)$/mg, '<strong>• $1</strong>');
        currentText = currentText.replace(/\n/g, "<br>");
        
        typingElement.innerHTML = currentText + '<span class="typing-cursor"></span>';
        
        setTimeout(() => {
            typeText(text, index + 1, callback, elementId);
        }, 50);
    } else {
        typingElement.innerHTML = text.replace(/^-(.+)$/mg, '<strong>• $1</strong>').replace(/\n/g, "<br>");
        callback();
    }
}

function showCard(cardNumber) {
    // Ẩn tất cả các section
    document.getElementById("card1-section").classList.add("d-none");
    document.getElementById("card2-section").classList.add("d-none");
    document.getElementById("card3-section").classList.add("d-none");
    document.getElementById("processing").classList.add("d-none");
    document.getElementById("summary-section").classList.add("d-none");
    document.getElementById("flow-section").classList.add("d-none");

    // Xóa trạng thái active của tất cả các card
    const cards = document.querySelectorAll("#card-section .card");
    cards.forEach(card => card.classList.remove("active"));

    // Thêm trạng thái active cho card được chọn
    const selectedCard = document.querySelector(`#card-section .col-md-4:nth-child(${cardNumber}) .card`);
    if (selectedCard) {
        selectedCard.classList.add("active");
    }

    // Hiển thị section tương ứng
    if (cardNumber === 1) {
        document.getElementById("card1-section").classList.remove("d-none");
    } else if (cardNumber === 2) {
        document.getElementById("card2-section").classList.remove("d-none");
    } else if (cardNumber === 3) {
        document.getElementById("card3-section").classList.remove("d-none");
    }
}

function createScenario(cardNumber) {
    // Hiện processing với hiệu ứng fade
    const processingElement = document.getElementById("processing");
    const summarySection = document.getElementById("summary-section");
    const flowSection = document.getElementById("flow-section");

    // Ẩn các section khác với hiệu ứng fade
    if (!summarySection.classList.contains('d-none')) {
        summarySection.classList.add('fade-out');
        setTimeout(() => {
            summarySection.classList.add('d-none');
            summarySection.classList.remove('fade-out');
        }, 500);
    }
    if (!flowSection.classList.contains('d-none')) {
        flowSection.classList.add('fade-out');
        setTimeout(() => {
            flowSection.classList.add('d-none');
            flowSection.classList.remove('fade-out');
        }, 500);
    }

    // Hiện processing
    processingElement.classList.remove('d-none');
    processingElement.classList.add('fade-in');

    setTimeout(() => {
        // Ẩn processing với hiệu ứng fade
        processingElement.classList.add('fade-out');
        setTimeout(() => {
            processingElement.classList.add('d-none');
            processingElement.classList.remove('fade-out');
            
            // Hiện summary section với hiệu ứng fade
            summarySection.classList.remove('d-none');
            summarySection.classList.add('fade-in');

            let summaryText = "";
            let svgContent = "";

            if (cardNumber === 1) {
                summaryText = `実行する必要がある操作の内容を要約する
-納品書の確認: 納品書と注文書を照る。数量、品名、品番などを確認する。
-入庫記録の入力: システムに納品内容を入力する（例: 商品名、数量、入庫日）。
-商品の検品: 商品に破損や不良品がないか検査する。
-保管場所の決定: 商品を保管する棚やエリアを決定する。
-作業記録の保存: システムに作業の進捗と完了情報を記録する。`;

                // Tạo SVG flow đơn giản (theo chiều dọc, màu cam #f7b066)
                svgContent = createFlowSVG(["納品書の確認","入庫記録の入力","商品の検品","保管場所の決定","作業記録の保存"], "#f7b066");

            } else if (cardNumber === 2) {
                summaryText = `変更内容の要約:
-追加: 「バーコードスキャン」と「温度・湿度チェック」ステップを導入。
-削除: 「保管場所の決定」をシステムによる自動化に変更。
-変更: 「入庫記録の入力」をバーコードスキャンによる自動入力へ改善。`;

                svgContent = createFlowSVG(["納品書の確認","バーコードスキャン","商品の検品","温度・湿度チェック（必要に応じて)","作業記録の保存"], "#f7b066", [1,3]);

            } else if (cardNumber === 3) {
                summaryText = `業務内容まとめ
空予約プロセスには、入力、検索、比較、予約、支払い、確認といた複数のステップが含まれています。`;

                svgContent = createFlowSVG(["航空券の条件入力","航空券検索","候補便の比較","予約情報の入力","支払い手続き","予約確認"], "#f7b066");
            }

            typeText(summaryText, 0, () => {
                document.getElementById("flow-section").classList.remove("d-none");
                const flowContainer = document.getElementById("flow-container");
                
                // Style cho flow-container
                flowContainer.style.width = 'auto';
                flowContainer.style.margin = 'auto';
                flowContainer.style.overflowX = 'auto';
                flowContainer.style.display = 'flex';
                flowContainer.style.flexDirection = 'column';
                flowContainer.style.alignItems = 'center';
                flowContainer.style.gap = '20px';
                
                // Thêm SVG và nút download
                flowContainer.innerHTML = `
                    ${svgContent}
                    <button class="btn btn-primary" onclick="downloadScenarioSVG()">ダウンロード</button>
                `;
            });
        }, 500);
    }, 2000);
}

function createFlowSVG(steps, color, greenIndices=[]) {
    const measureText = (text) => {
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.fontSize = '14px';
        temp.style.position = 'absolute';
        temp.innerHTML = text;
        document.body.appendChild(temp);
        const width = temp.offsetWidth;
        document.body.removeChild(temp);
        return width;
    };

    // Tính toán chiều rộng cần thiết cho mỗi box
    let maxWidth = 120;
    steps.forEach(step => {
        const textWidth = measureText(step);
        maxWidth = Math.max(maxWidth, textWidth + 60);
    });

    // Tính toán kích thước SVG
    let svgWidth = maxWidth + 80;
    let svgHeight = (steps.length * 100) + 40;
    let startX = (svgWidth - maxWidth) / 2; // Tính toán vị trí x bắt đầu của rect

    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: auto;">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0d6efd"></polygon>
        </marker>
    </defs>`;

    steps.forEach((step, index) => {
        let rectColor = color;
        if (greenIndices && greenIndices.includes(index)) {
            rectColor = "#C1E5F5";
        }

        let y = 20 + index * 100;
        let centerX = svgWidth / 2; // Tính toán điểm giữa SVG
        
        if (step === "温度・湿度チェック（必要に応じて)") {
            svg += `<rect x="${startX}" y="${y}" width="${maxWidth}" height="60" rx="10" fill="${rectColor}"></rect>`;
            svg += `
            <text x="${centerX}" y="${y + 25}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="black">
                <tspan x="${centerX}" dy="0">温度・湿度チェック</tspan>
                <tspan x="${centerX}" dy="20">（必要に応じて)</tspan>
            </text>`;
        } else {
            svg += `<rect x="${startX}" y="${y}" width="${maxWidth}" height="50" rx="10" fill="${rectColor}"></rect>`;
            svg += `<text x="${centerX}" y="${y+30}" text-anchor="middle" font-size="14" fill="black">${step}</text>`;
        }

        if (index < steps.length - 1) {
            let arrowStartY = y + (step === "温度・湿度チェック（必要に応じて)" ? 60 : 50);
            svg += `<line x1="${centerX}" y1="${arrowStartY}" x2="${centerX}" y2="${y + 100}" stroke="#0d6efd" stroke-width="2" marker-end="url(#arrowhead)" />`;
        }
    });

    svg += `</svg>`;
    return svg;
}

function downloadScenarioSVG() {
    const flowContainer = document.getElementById("flow-container");
    if (!flowContainer) return;
    const svgElement = flowContainer.querySelector("svg");
    if (!svgElement) return;

    const svgContent = svgElement.outerHTML;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "scenario.svg";
    link.click();
}
