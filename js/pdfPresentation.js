document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('submit_file')
        .addEventListener('click', () => {

            window.$ = window.jQuery = require('jquery');
            const myState = {
                pdf: null,
                currentPage: 1,
            };

            function render() {
                myState.pdf.getPage(myState.currentPage).then((page) => {
                    const canvas = document.getElementById("pdf_render");
                    const ctx = canvas.getContext("2d");
                    const viewport = page.getViewport(1);
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    page.render({
                        canvasContext: ctx,
                        viewport: viewport
                    });
                });
            }

            pdfjsLib.getDocument(document.getElementById('file_upload').files[0].path).then((pdf) => {
                myState.pdf = pdf;
                render();
            });

            const currentPage = $('#current_page');

            $('#go_previous').click(function () {
                if(myState.pdf == null || myState.currentPage === 1) {
                    return;
                }
                myState.currentPage -= 1;
                currentPage.val(myState.currentPage);
                render();
            });

            $('#go_next').click(function () {
                if(myState.pdf == null || myState.currentPage > myState.pdf._pdfInfo.numPages) {
                    return;
                }
                myState.currentPage += 1;
                currentPage.val(myState.currentPage);
                render();
            });

            currentPage.keypress(function (e) {
                if(!myState.pdf) {
                    return;
                }
                const code = e.keyCode;

                if(code === 13) {
                    const desiredPage = parseInt(currentPage.val());
                    if(desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
                        myState.currentPage = desiredPage;
                        currentPage.val(desiredPage);
                        render();
                    }
                }
            });
        });
});