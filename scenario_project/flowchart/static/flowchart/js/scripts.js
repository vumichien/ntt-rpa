function showProcessing() {
    const processingSection = document.getElementById("processing");
    const hintSection = document.getElementById("hint-section");

    processingSection.classList.remove("d-none");

    setTimeout(() => {
        processingSection.classList.add("d-none");
        hintSection.classList.remove("d-none");
    }, 2000); // Delay 3 giây
}

function generateFlows() {
    const flowchartsSection = document.getElementById("flowcharts-section");

    // Hiển thị flowchart
    flowchartsSection.classList.remove("d-none");
}

function redirectToChatbot() {
    window.location.href = '/flowchart/chatbot/';
}

function downloadSVG() {
    // Lấy phần tử chứa SVG
    const flowchartContainer = document.getElementById('import-scenario');
    if (!flowchartContainer) {
        alert('SVG element not found!');
        return;
    }

    // Tìm thẻ <svg> bên trong phần tử
    const svgElement = flowchartContainer.querySelector('svg');
    if (!svgElement) {
        alert('No SVG found in the specified container!');
        return;
    }

    // Chuẩn bị dữ liệu SVG
    const svgContent = svgElement.outerHTML;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });

    // Tạo link để tải xuống
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'import-scenario.svg'; // Tên file khi tải xuống
    link.click();
}
