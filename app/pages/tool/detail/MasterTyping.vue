<template>
    <div>
        <div>

            <div class="main-content">
                <div class="heading">
                    <span>🕹️&nbsp;</span><span>G</span><span>A</span><span>M</span><span>E</span><span>Z</span><span>O</span><span>N</span><span>E</span>
                </div>
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search" onkeyup="search_game()" id="searchbar">
                    <div class="search-btn">
                        <i class="fa fa-search" aria-hidden="true"></i>

                    </div>
                </div>
                <br>

                <!-- Games -->


                <ul class="project-list">
                </ul>

                <div class="pagination">
                    <button id="prev-page-tile" onclick="goToPreviousPage()">Previous</button>
                    <div class="pagination_section"></div>
                    <button id="next-page-tile" onclick="goToNextPage()">Next</button>
                </div>


            </div>

        </div>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    </div>
</template>

<script>

useToolSeo({
    title: "打字练习工具",
    description: "一个免费的在线打字练习工具，包含英文单词与指法练习",
    keywords: "打字练习器,在线打字练习",
    path: "/tool/detail/MasterTyping",
})
</script>
<style scoped></style>