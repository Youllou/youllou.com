<script setup lang="ts">
  const { locale, locales, setLocale,t, tm} = useI18n()

  const { data, pending, error } = await useFetch('/api/github')
  const projects = data.value || []
  let toc = ref([
    { title: t('about.toc.introduction'), link: '#introduction' },
    { title: t('about.toc.timeline'), link: '#timeline' },
    //{ title: t('about.toc.goals'), link: '#goals' },
    { title: t('about.toc.projects'), link: '#projects' },
    //{ title: t('about.toc.rankings'), link: '#rankings' },
    { title: t('about.toc.contacts'), link: '#contacts' },
  ]);

  const locales_items = locales.value.reduce((acc, loc) => {
    acc[loc.code] = loc.name
    return acc
  }, {})
  const locales_value = computed({
    get: () => locale.value,
    set: (val) => setLocale(val)
  })


  const tmd_items = tm('about.timeline.items')
  let reconstructed_items = ref([])
  for (const item of tmd_items) {
    let reconstructed: {
      title: string;
      startDate: string;
      endDate?: string;
      description: string;
      inverted?: boolean;
      link?: string;
    } = {
      title: item.title.b?.s || item.title.body.static,
      startDate: item.startDate.b?.s || item.startDate.body.static,
      endDate : item.endDate?.b?.s || item.endDate?.body.static,
      description: item.description.b?.s || item.description.body.static,
      inverted: item.inverted?.b?.s || item.inverted?.body.static || false,
      link: item.link?.b?.s || item.link?.body.static
    }
    reconstructed_items.value.push(reconstructed)
  }



</script>

<template>
  <div class="background">
    <div class="decorations">
      <USelect
          v-model="locales_value"
          :items="Object.keys(locales_items)"
          @change="setLocale($event)"
          class="locale-selector"
          style="position: absolute; top: 2rem; right: 3rem; z-index: 1000;"
      />
    </div>
    <div class="mobile-toc">
      <h2>{{$t('about.toc.title')}}</h2>
      <ul class="mobile toc">
        <li v-for="item in toc" :key="item.title">
          <a :href="item.link">{{ item.title }}</a>
        </li>
      </ul>
    </div>
    <div class="outer-container">

      <div class="inner-border">
        <div class="content">
          <div id="introduction">
            <div class="intro-content">
              <h1>{{$t('about.introduction.title')}}</h1>
              <p v-html="$t('about.introduction.content')"></p>
            </div>
            <div class="intro-image">
              <NuxtImg
                  src="/assets/images/me.png"
                  alt="Hi ! It's me Youllou!"
                  width="300"
                  height="auto"
              />
            </div>
          </div>

          <h1 id="timeline">{{$t('about.timeline.title')}}</h1>
          <Timeline
            :items="reconstructed_items"
            class="timeline"
          />



          <h1 id="projects">{{$t('about.projects.title')}}</h1>
          <p v-html="$t('about.projects.description')"></p>
          <div class="projects-list">
            <div v-for="project in projects" :key="project.name" class="project-item">
              <h2>{{ project.name }}</h2>
              <p>{{ project.description }}</p>
              <a :href="project.url" target="_blank" rel="noopener noreferrer" class="project-link">View Project</a>
            </div>
          </div>
        </div>
      </div>


      <div class="contacts">
        <h1 id="contacts">{{$t('about.contacts.title')}}</h1>
        <p v-html="$t('about.contacts.description')"></p>
        <ul>
          <li><a href="https://www.linkedin.com/in/jules-barbier-bordere/" target="_blank" rel="noopener noreferrer"><img src="/assets/icons/linkedin.svg" alt="linkedin" width="32"> </a></li>
          <li><a href="https://github.com/youllou" target="_blank" rel="noopener noreferrer"><img src="/assets/icons/github.svg" alt="github" width="32"></a></li>
          <li><a href="https://instagram.com/youl__lou" target="_blank" rel="noopener noreferrer"><img src="/assets/icons/instagram.svg" width="32"></a></li>
          <li><a href="mailto://contact@youllou.com"><img src="/assets/icons/mail.svg" width="32"></a></li>
        </ul>
      </div>





      <div class="desk-toc">
        <h2>{{$t('about.toc.title')}}</h2>
        <ul class="toc">
          <li v-for="item in toc" :key="item.title">
            <a :href="item.link">{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<style scoped>

  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #eeeeee;
    text-decoration: underline;
    text-decoration-color: #be67be;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .background {
    background-color: #2f2f2f;
    min-height: 100vh;
  }

  .decorations {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
  }

  .outer-container {
    padding: 5%;
    display: grid;
    grid-template-columns: 6fr 1fr;
    grid-template-areas: "content toc"
                         "contact contact";
    gap: 2rem;

  }



  .inner-border {
    background-image: url("/assets/images/border.svg");
    background-repeat: no-repeat;
    padding: 2rem;
  }

  .content {
    grid-area: content;
    color: #cccccc;
    padding-right: 2%;
  }


  #introduction {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
  .intro-content h1{
    margin-top: 0;
  }



  .toc{
    text-decoration: underline;
    text-decoration-color: #be67be;
  }
  .toc li {
    margin: 0.5rem 0;
  }

  .desk-toc{
    position: fixed;
    grid-area: toc;
    top: calc(5% + 2rem);
    left: 82%;
  }

  .mobile-toc{
    display: none;
    position: relative;
    padding: 5% 5% 0;
  }

  .mobile.toc{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    #introduction {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
    }

    .outer-container {
      grid-template-columns: 1fr;
      padding:0 0 5% 0;
    }
    .inner-border {
      padding-right: 7%;
    }
    .desk-toc {
      display: none;
      position: static;
      margin-top: 2rem;
    }

    .mobile-toc {
      display: block;
    }

    .contacts{
      width: calc(100% - 2rem);
    }
  }



  .project-item{
    background-color: #1a1a1a;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .project-link{
    color: #be67be;
    font-size: 0.8rem;
    text-decoration: underline;
  }


  .contacts{
    grid-area: contact;
    color: #cccccc;
    padding: 2rem;
  }

  .contacts ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
</style>