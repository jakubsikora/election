<template>
  <div id="app">
    <header>
      <div class="container">
        <div class="row">
          <div class="col-md-10 col-md-offset-1">
            <div class="site-heading">
              <h1>Who do you think will win this year?</h1>
              <span>Just let us know below who you want to win</span>
            </div>
          </div>
        </div>
      </div>
    </header>

      <div class="container cast-vote">
        <div class="row">
          <div class="col-lg-8 col-lg-offset-2">
            <div class="panel panel-default">
              <div class="panel-body">
                <form>
                  <input type="hidden" name="honeypot" id="honeypot" />
                  <transition name="fade-out1">
                    <div v-if="loaded">
                      <div v-if="!voted">
                        <h3>Cast your vote</h3>
                        <p>
                          <a class='btn' @click="addClintonVote"><img src='./assets/hex-clinton.png' width=100 /></a>
                          <span>or</span>
                          <a class='btn' @click="addTrumpVote"><img src='./assets/hex-trump.png' width=100 /></a>
                        </p>
                      </div>
                    </div>
                  </transition>
                  <transition name="fade">
                    <div v-if="voted">
                      <h3>Thank you for your vote.</h3>
                    </div>
                  </transition>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade-out">
      <div class="container vote-results" v-if="ready">
        <div class="row">
          <div class="col-md-12">
            <h4>Results</h4>
          </div>
        </div>
        <div class="results-container">
          <div>
            <small>({{ clintonVotes.length }})</small>
            {{ clintonResults }}
            <img src='./assets/hex-clinton.png' />
          </div>
          <div class="results">
            <div class="clinton-results" :style="{width: clintonResults }" ></div>
            <div class="trump-results" :style="{width: trumpResults }"></div>
          </div>
          <div>
            <img src='./assets/hex-trump.png' />
            {{ trumpResults }} <small>({{ trumpVotes.length }})</small>
          </div>
        </div>
      </div>
    </transition>

    <footer class="footer">
      <div class="container">
        <iframe src="https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Felection2016.me&layout=button_count&size=large&mobile_iframe=true&appId=263717277053356&width=115&height=28" width="115" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
        <a class="twitter-share-button"
          href="https://twitter.com/intent/tweet?text=Who%20do%20you%20think%20will%20win%20this%20year%20%40realDonaldTrump%20or%20%40HillaryClinton%20%23USElection"
          data-size="large">
          Tweet</a>
      </div>
    </footer>
</template>

<script>
import Vue from 'vue';
import VueFire from 'vuefire';
import firebase from 'firebase';
import cookies from 'browser-cookies';
import Chart from 'chart.js';
import axios from 'axios';

// explicit installation required in module environments
Vue.use(VueFire);

const db = firebase.initializeApp({
  databaseURL: 'https://us-election-af6c9.firebaseio.com',
}).database();

const votesRef = db.ref('votes');
const STORAGE_KEY = 'US_ELECTION';

export default {
  name: 'app',
  data() {
    return {
      voted: false,
      loaded: false,
      ready: false,
      trumpResults: '0%',
      clintonResults: '0%',
      trumpVotes: [],
      clintonVotes: [],
    };
  },
  methods: {
    addTrumpVote() {
      this.addVote('trump');
    },
    addClintonVote() {
      this.addVote('clinton');
    },
    addVote(candidate) {
      const honeypot = document.getElementById('honeypot');

      if (!honeypot.value) {
        this.voted = true;
        this.setStorage();
        votesRef.push(Object.assign({}, { candidate }, this.client));
      }
    },
    validate() {
      const recaptchaResponse = document
        .querySelector('.g-recaptcha-response').value;

      if (recaptchaResponse) {
        return axios.get('http://recaptcha.jsikora.io', {
          params: {
            recaptchaResponse,
          },
        })
        .then(response => response);
      }

      return Promise.reject();
    },
    setStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, 1);
      } catch (err) {
        //
      }

      cookies.set(STORAGE_KEY, '1');
    },
    checkStorage() {
      try {
        if (localStorage.getItem(STORAGE_KEY) === '1') {
          this.voted = true;
        }
      } catch (err) {
        // console.log(err);
      }

      if (cookies.get(STORAGE_KEY) === '1') {
        this.voted = true;
      }
    },
  },
  mounted() {
    let clintonLoaded = false;
    let trumpLoaded = false;

    const loadChart = () => {
      if (clintonLoaded && trumpLoaded) {
        this.ready = true;
        const allVotes = this.trumpVotes.length + this.clintonVotes.length;

        const trumpPercent = allVotes
          ? (this.trumpVotes.length / allVotes) * 100
          : 0;
        const clintonPercent = allVotes
          ? (this.clintonVotes.length / allVotes) * 100
          : 0;

        this.trumpResults = `${trumpPercent.toFixed(2)}%`;
        this.clintonResults = `${clintonPercent.toFixed(2)}%`;
      }
    };

    votesRef
      .orderByChild('candidate')
      .equalTo('trump')
      .on('value', (snapshot) => {
        const votes = snapshot.val();
        trumpLoaded = true;

        if (votes) {
          this.trumpVotes = Object.keys(votes).map(key => votes[key]);
        }

        loadChart();
      });

    votesRef
      .orderByChild('candidate')
      .equalTo('clinton')
      .on('value', (snapshot) => {
        const votes = snapshot.val();
        clintonLoaded = true;

        if (votes) {
          this.clintonVotes = Object.keys(votes).map(key => votes[key]);
        }

        loadChart();
      });

    this.checkStorage();
    this.loaded = true;
  },
};
</script>

<style>
#app {

}

body {
  color: #333;
  font-size: 20px;
  background-color: #dad8d8;
}

header {
  margin-bottom: -70px;
  background-color: #286090;
}

hr.small {
  max-width: 100px;
  margin: 15x auto;
  border-width: 4px;
  border-color: #fff;
}

.site-heading {
  padding: 80px 0;
  color: #fff;
  text-align: center;
}

.site-heading p {
  margin-top: 20px;
}

.vote-buttons {
  margin-top: 20px;
}

.cast-vote {
  position: relative;
}

.cast-vote .panel-body {
  text-align: center;
  min-height: 218px;
}

.vote-results {
  background-color: #fff;
  width: 100%;
  text-align: center;
  margin-bottom: 50px;
  opacity: 1;
}

.vote-results h4 {
  color: #ccc;
}

.g-recaptcha > div {
  margin: 0 auto;
}

.results-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.results-container img {
  max-width: 80px;
  height: auto;
  max-height: 80px;
}

.results-container .results {
  width: 50%;
  display: flex;
  justify-content: center;
}

.results-container .results .clinton-results {
  background-color: #c9302c;
  height: 20px;
}

.results-container .results .trump-results {
  background-color: #286090;
  height: 20px;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 56px;
  background-color: #f5f5f5;
}

.footer .container {
  text-align: center;
  padding-top: 14px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

.fade-out-enter-active, .fade-out-leave-active {
  transition: opacity 1s;
}

.fade-out-enter, .fade-out-leave-active {
  opacity: 0;
}

.fade-out1-enter-active, .fade-out1-leave-active {
  transition: opacity 1.5s;
}

.fade-out1-enter, .fade-out1-leave-active {
  opacity: 0;
}

</style>
