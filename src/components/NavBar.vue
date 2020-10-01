<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <router-link to="/" activeClass="active" class="nav-item" tag="li"><a class="nav-link">Home</a></router-link>
                <router-link to="/about" activeClass="active" class="nav-item" tag="li"><a class="nav-link">About</a></router-link>
            </ul>
        </div>
    </nav>
</template>
<script>
export default {
    
}
</script>