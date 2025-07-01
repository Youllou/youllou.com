<script setup lang="ts">
  const { locale, locales, setLocale,t, tm} = useI18n()

  let toc = ref([
    { title: t('about.toc.introduction'), link: '#introduction' },
    { title: t('about.toc.timeline'), link: '#timeline' },
    { title: t('about.toc.goals'), link: '#goals' },
    { title: t('about.toc.projects'), link: '#projects' },
    { title: t('about.toc.rankings'), link: '#rankings' },
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
      title: item.title.body.static,
      startDate: item.startDate.body.static,
      endDate : item.endDate?.body.static,
      description: item.description.body.static,
      inverted: item.inverted?.body.static || false,
      link: item.link?.body.static
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



          <h1> Other stuff</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquam velit at arcu facilisis, sodales cursus lectus ornare. Maecenas ut diam nec urna lacinia dapibus a sed erat. Vivamus fringilla felis sit amet arcu faucibus, pellentesque volutpat purus semper. Aenean condimentum est vel mauris rutrum sagittis. Phasellus porttitor ligula in gravida venenatis. Duis suscipit, ex sed consequat suscipit, sem arcu consectetur risus, nec vulputate nibh ante vitae nulla. Cras vel turpis tincidunt, aliquam mi at, tincidunt augue.
          </p>
          <p>
            Maecenas euismod luctus lorem volutpat condimentum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris sed venenatis mauris. Aliquam ac massa sapien. In sed est sit amet odio dignissim luctus quis quis felis. Morbi et erat lacinia sem facilisis molestie. Nullam auctor, ipsum non blandit auctor, ante turpis feugiat velit, ut blandit urna mauris vel nunc. Aenean tempus fringilla eros vel blandit. Morbi ullamcorper lectus at augue tincidunt, ac rhoncus nisl aliquam. In scelerisque urna elit, at hendrerit velit sodales euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus sem risus, eget molestie mi eleifend eget. Nulla facilisi. Maecenas ullamcorper ante felis, a pulvinar magna facilisis et.
          </p>
          <p>
            Duis tortor felis, condimentum quis quam et, pellentesque accumsan tortor. Cras ut tristique quam. Proin tristique, dui eu porta rhoncus, turpis ante cursus enim, id bibendum arcu libero quis felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae ipsum sed urna congue bibendum. Quisque vel enim porta, hendrerit massa ac, tincidunt urna. Nunc sed commodo massa. Vivamus sit amet dictum ex, nec dictum nunc. Pellentesque cursus lectus lectus, non eleifend felis tempor at. Cras non nunc sed odio varius ultricies. Donec feugiat ultricies interdum. Duis venenatis ante faucibus, iaculis nunc non, faucibus lacus. Aliquam semper, justo sit amet scelerisque finibus, orci ex placerat arcu, vitae sagittis nunc diam id ipsum.
          </p>
          <p>
            Etiam in eros arcu. Quisque auctor nunc et ex rutrum bibendum. Sed eget faucibus purus. Etiam faucibus volutpat erat ut sodales. Curabitur ullamcorper enim sit amet facilisis euismod. Proin ornare, velit id iaculis fermentum, magna tellus tincidunt sem, ullamcorper sodales elit erat id velit. Proin sollicitudin a tellus at faucibus. Maecenas tempus magna at leo fringilla ullamcorper. Duis consequat lacus elit, ut efficitur nibh interdum ac. Proin eros elit, fringilla id elit quis, pellentesque dignissim nulla.
          </p>
          <p>
            Donec accumsan, tellus eget tincidunt condimentum, libero turpis finibus nibh, quis tincidunt purus urna sed ex. Nam ante nibh, lobortis sit amet nunc nec, viverra tincidunt eros. Ut porta nibh sed enim porta, vitae varius nisi pellentesque. In a fringilla dolor, at pretium nibh. Duis euismod sit amet turpis aliquam elementum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla tempor, justo vitae sollicitudin convallis, justo libero tempus felis, et ultrices mauris ipsum at elit. Donec vel elit ipsum. Nullam accumsan lacinia mi id euismod. Duis ut lorem sit amet quam euismod sollicitudin et in nibh. Vivamus lacinia euismod urna, a fringilla nulla rhoncus imperdiet. Proin hendrerit cursus convallis. Fusce pellentesque placerat purus vitae rhoncus.
          </p>
        </div>
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
    gap: 2rem;

  }



  .inner-border {
    background-image: url("/assets/images/border.svg");
    background-repeat: no-repeat;
    padding: 2rem;
  }

  .content {
    color: #cccccc;
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
    .outer-container {
      grid-template-columns: 1fr;
    }

    .desk-toc {
      display: none;
      position: static;
      margin-top: 2rem;
    }

    .mobile-toc {
      display: block;
    }
  }





</style>