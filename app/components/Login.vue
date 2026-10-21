<template>
    <div v-show="store.showLogin" class="
              modal-show
              flex
              items-center
              w-full
              h-full
              fixed
              top-0
              left-0
              z-40
              bg-gray-500
              opacity-100
              justify-center
            ">
        <div v-show="view === 'login'" @keyup.enter="login()" class="modal-content bg-white w-80 pt-12 p-4 relative rounded-md">
            <span class="right-0 top-0 absolute m-2 w-5 h-5 iconfont icon-close cursor-pointer text-gray-400 transition-colors duration-200 hover:text-blue-600" @click="close()" />
            <img class="left-0 top-0 w-20 absolute m-2" src="/logo-black.png" alt="" />
            <p class="text-2xl font-semibold my-2">登陆</p>
            <input v-model="loginParams.email" type="text" placeholder="邮箱地址" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <input v-model="loginParams.password" type="password" placeholder="密码" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <div class="flex items-center justify-around">
                <input v-model="captcha" type="text" placeholder="验证码" class="
                    bg-gray-100
                    w-3
                    border-0 border-transparent
                    focus:outline-none
                    custom-font-14
                    text-gray-600
                    p-2
                    my-2
                    mr-2
                    flex-1
                  " />
                <img class="h-9 flex-1 cursor-pointer transition-opacity duration-200 hover:opacity-80" @click="refreshCaptcha()" :src="captchaUrlPic" crossorigin="anonymous" />
            </div>
            <button type="button" :disabled="loginLoading" class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 my-2 rounded-sm cursor-pointer transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60" @click="login()">
                {{ loginLoading ? '登陆中...' : '登陆' }}
            </button>
            <div class="mt-2 flex justify-between">
                <p class="custom-font-12">
                    还没有账号？
                    <span @click="toRegister()" class="text-blue-600 cursor-pointer font-medium transition-colors duration-200 hover:text-blue-700 hover:underline">立即注册</span>
                </p>
                <p class="custom-font-12">
                    <a @click="toForgot()" class="text-blue-600 cursor-pointer font-medium transition-colors duration-200 hover:text-blue-700 hover:underline">忘记密码?</a>
                </p>
            </div>
        </div>
        <div v-show="view === 'register'" @keyup.enter="register()" class="modal-content bg-white w-80 pt-12 p-4 relative rounded-md">
            <span class="right-0 top-0 absolute m-2 w-5 h-5 iconfont icon-close cursor-pointer text-gray-400 transition-colors duration-200 hover:text-blue-600" @click="close()" />
            <img class="left-0 top-0 w-20 absolute m-2" src="/logo-black.png" alt="" />
            <p class="text-2xl font-semibold my-2">注册账号</p>
            <input v-model="registerParams.email" type="text" placeholder="邮箱地址" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <div class="flex">
                <input v-model="captchaEmail" type="text" placeholder="邮箱验证码" class="
                    bg-gray-100
                    w-3
                    border-0 border-transparent
                    focus:outline-none
                    custom-font-14
                    text-gray-600
                    p-2
                    my-2
                    mr-2
                    flex-1
                  " />
                <button type="button" :disabled="sending('register') || emailCodeLoading === 'register'" @click="sendEmailCode('register')" class="
                    flex-1
                    bg-blue-500
                    text-white
                    p-2
                    my-2
                    custom-font-14
                    cursor-pointer
                    transition-colors
                    duration-200
                    hover:bg-blue-600
                    active:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  ">
                    {{ sendText('register') }}
                </button>
            </div>
            <input v-model="registerParams.name" type="text" placeholder="用户名" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <input v-model="registerParams.password" type="password" placeholder="密码" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <input v-model="repassword" type="password" placeholder="再输一遍密码" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <div class="flex items-center justify-around">
                <input v-model="captcha" type="text" placeholder="验证码" class="
                    bg-gray-100
                    w-3
                    border-0 border-transparent
                    focus:outline-none
                    custom-font-14
                    text-gray-600
                    p-2
                    my-2
                    mr-2
                    flex-1
                  " />
                <img class="h-9 flex-1 cursor-pointer transition-opacity duration-200 hover:opacity-80" @click="refreshCaptcha()" :src="captchaUrlPic" crossorigin="anonymous" />
            </div>
            <button type="button" :disabled="registerLoading" class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 my-2 rounded-sm cursor-pointer transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60" @click="register()">
                {{ registerLoading ? '注册中...' : '注册' }}
            </button>

            <div class="mt-2 flex justify-between">
                <p class="custom-font-12">
                    已有账号？
                    <span @click="toLogin()" class="text-blue-600 cursor-pointer font-medium transition-colors duration-200 hover:text-blue-700 hover:underline">立即登陆</span>
                </p>
                <p class="custom-font-12">
                    <a @click="toForgot()" class="text-blue-600 cursor-pointer font-medium transition-colors duration-200 hover:text-blue-700 hover:underline">忘记密码?</a>
                </p>
            </div>
        </div>
        <div v-show="view === 'forgot'" @keyup.enter="resetPassword()" class="modal-content bg-white w-80 pt-12 p-4 relative rounded-md">
            <span class="right-0 top-0 absolute m-2 w-5 h-5 iconfont icon-close cursor-pointer text-gray-400 transition-colors duration-200 hover:text-blue-600" @click="close()" />
            <img class="left-0 top-0 w-20 absolute m-2" src="/logo-black.png" alt="" />
            <p class="text-2xl font-semibold my-2">找回密码</p>
            <input v-model="forgotParams.email" type="text" placeholder="邮箱地址" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <div class="flex">
                <input v-model="forgotCode" type="text" placeholder="邮箱验证码" class="
                    bg-gray-100
                    w-3
                    border-0 border-transparent
                    focus:outline-none
                    custom-font-14
                    text-gray-600
                    p-2
                    my-2
                    mr-2
                    flex-1
                  " />
                <button type="button" :disabled="sending('forget') || emailCodeLoading === 'forget'" @click="sendEmailCode('forget')" class="
                    flex-1
                    bg-blue-500
                    text-white
                    p-2
                    my-2
                    custom-font-14
                    cursor-pointer
                    transition-colors
                    duration-200
                    hover:bg-blue-600
                    active:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  ">
                    {{ sendText('forget') }}
                </button>
            </div>
            <input v-model="forgotParams.password" type="password" placeholder="新密码" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <input v-model="forgotRepassword" type="password" placeholder="再输一遍新密码" class="
                  bg-gray-100
                  border-0 border-transparent
                  focus:outline-none
                  custom-font-14
                  text-gray-600
                  p-2
                  my-2
                  w-full
                " />
            <div class="flex items-center justify-around">
                <input v-model="captcha" type="text" placeholder="验证码" class="
                    bg-gray-100
                    w-3
                    border-0 border-transparent
                    focus:outline-none
                    custom-font-14
                    text-gray-600
                    p-2
                    my-2
                    mr-2
                    flex-1
                  " />
                <img class="h-9 flex-1 cursor-pointer transition-opacity duration-200 hover:opacity-80" @click="refreshCaptcha()" :src="captchaUrlPic" crossorigin="anonymous" />
            </div>
            <button type="button" :disabled="resetLoading" class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 my-2 rounded-sm cursor-pointer transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60" @click="resetPassword()">
                {{ resetLoading ? '提交中...' : '重置密码' }}
            </button>

            <div class="mt-2 flex justify-between">
                <p class="custom-font-12">
                    想起密码了？
                    <span @click="toLogin()" class="text-blue-600 cursor-pointer font-medium transition-colors duration-200 hover:text-blue-700 hover:underline">立即登陆</span>
                </p>
                <p class="custom-font-12">
                    还没有账号？
                    <span @click="toRegister()" class="text-blue-600 cursor-pointer font-medium transition-colors duration-200 hover:text-blue-700 hover:underline">立即注册</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from "../api/api";
import { nanoid } from "nanoid";
import { TextUtils } from "~/utils/TextUtils";
import { userStore } from '~/stores/user';
import request from "~/api/request";
const store = userStore();

type View = 'login' | 'register' | 'forgot'
type EmailCodeType = 'register' | 'forget'

const view = ref<View>('login');
const captchaUrl = ref("");
const captchaUrlPic = ref("");
const loginParams = ref({
    email: "",
    password: "",
});
const registerParams = ({
    email: "",
    name: "",
    password: "",
});
const forgotParams = ref({
    email: "",
    password: "",
});
const captcha = ref("");
const captchaEmail = ref("");
const forgotCode = ref("");
const captchaKey = ref("");
const repassword = ref("");
const forgotRepassword = ref("");
const countdown = ref(0);
const countdownType = ref<EmailCodeType | ''>('');
const loginLoading = ref(false);
const registerLoading = ref(false);
const resetLoading = ref(false);
const emailCodeLoading = ref<EmailCodeType | ''>('');
let countdownTimer: ReturnType<typeof setInterval> | null = null;

let uuid = nanoid(10);
captchaKey.value = uuid;
const { $toast } = useNuxtApp()
const token = useCookie("token", {
    maxAge: 60 * 60 * 24 * 14
})

function close() {
    store.$patch({
        showLogin: !store.showLogin
    })
}

function refreshCaptcha() {
    captchaUrlPic.value =
        captchaUrl.value + captchaKey.value + "&t=" + new Date().getTime();
}

function toLogin() {
    view.value = 'login';
    refreshCaptcha();
    clearData();
}
function toRegister() {
    view.value = 'register';
    refreshCaptcha();
    clearData();
}
function toForgot() {
    view.value = 'forgot';
    refreshCaptcha();
    clearData();
}
function clearData() {
    loginParams.value.email = "";
    loginParams.value.password = "";
    registerParams.email = "";
    registerParams.name = "";
    registerParams.password = "";
    forgotParams.value.email = "";
    forgotParams.value.password = "";
    captcha.value = "";
    captchaEmail.value = "";
    forgotCode.value = "";
    repassword.value = "";
    forgotRepassword.value = "";
}
function sending(type: EmailCodeType) {
    return countdownType.value === type && countdown.value > 0;
}
function sendText(type: EmailCodeType) {
    if (emailCodeLoading.value === type) return "发送中...";
    return sending(type) ? countdown.value + "s 后重发" : "发送";
}
function startCountdown(type: EmailCodeType) {
    countdownType.value = type;
    countdown.value = 60;
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            countdown.value = 0;
            countdownType.value = '';
            if (countdownTimer) clearInterval(countdownTimer);
            countdownTimer = null;
        }
    }, 1000);
}
async function login() {
    if (loginLoading.value || !checkLogin()) return;
    loginLoading.value = true;
    try {
        let result = await api.user.login(
            loginParams.value,
            captcha.value,
            captchaKey.value
        );
        refreshCaptcha();
        captcha.value = "";
        if (result.success) {

            $toast.success(result.message);
            token.value = (result.data.password)
            store.$patch({
                isLogin: true,
                info: null,
                infoLoaded: false,
            })
            await nextTick()
            store.loadInfo()
            close();
        } else {
            $toast.error(result.message);
        }
    } finally {
        loginLoading.value = false;
    }
}
async function sendEmailCode(type: EmailCodeType) {
    const email = type === 'forget' ? forgotParams.value.email : registerParams.email;
    if (!TextUtils.checkEmail(email)) {
        $toast.info("邮箱格式不正确");
        return false;
    }
    if (sending(type) || emailCodeLoading.value === type) return false;
    emailCodeLoading.value = type;
    try {
        let result = await api.user.sendEmailCaptcha(email, type);
        if (result.success) {
            $toast.success(result.message);
            startCountdown(type);
        } else {
            $toast.error(result.message);
        }
    } finally {
        emailCodeLoading.value = '';
    }
}
async function register() {
    if (registerLoading.value || !checkRegister()) return;
    registerLoading.value = true;
    try {
        let result = await api.user.register(
            registerParams,
            captchaEmail.value,
            captcha.value,
            captchaKey.value
        );
        refreshCaptcha();
        if (result.success) {
            $toast.success(result.message);
            toLogin();
        } else {
            $toast.error(result.message);
        }
    } finally {
        registerLoading.value = false;
    }
}
async function resetPassword() {
    if (resetLoading.value || !checkForgot()) return;
    resetLoading.value = true;
    try {
        let result = await api.user.resetPassword(
            forgotParams.value,
            forgotCode.value,
            captcha.value,
            captchaKey.value
        );
        refreshCaptcha();
        captcha.value = "";
        if (result.success) {
            $toast.success(result.message);
            toLogin();
        } else {
            $toast.error(result.message);
        }
    } finally {
        resetLoading.value = false;
    }
}
function checkLogin(): boolean {
    if (!TextUtils.checkEmail(loginParams.value.email)) {
        $toast.info("邮箱格式不正确");
        return false;
    }
    if (TextUtils.isNullOrEmpty(loginParams.value.password)) {
        $toast.info("密码不能为空");
        return false;
    }
    if (TextUtils.isNullOrEmpty(captcha.value)) {
        $toast.info("验证码不能为空");
        return false;
    }

    return true;
}
function checkRegister(): boolean {
    if (!TextUtils.checkEmail(registerParams.email)) {
        $toast.info("邮箱格式不正确");
        return false;
    }
    if (TextUtils.isNullOrEmpty(captchaEmail.value)) {
        $toast.info("邮箱验证码不能为空");
        return false;
    }
    if (
        TextUtils.isNullOrEmpty(registerParams.password) &&
        TextUtils.isNullOrEmpty(repassword.value)
    ) {
        $toast.info("密码不能为空");
        return false;
    }
    if (
        TextUtils.isNullOrEmpty(registerParams.password) &&
        TextUtils.isNullOrEmpty(repassword.value)
    ) {
        $toast.info("密码不能为空");
        return false;
    }
    if (registerParams.password != repassword.value) {
        $toast.info("两次输入的密码不一致");
        return false;
    }
    if (TextUtils.isNullOrEmpty(captcha.value)) {
        $toast.info("验证码不能为空");
        return false;
    }

    return true;
}
function checkForgot(): boolean {
    if (!TextUtils.checkEmail(forgotParams.value.email)) {
        $toast.info("邮箱格式不正确");
        return false;
    }
    if (TextUtils.isNullOrEmpty(forgotCode.value)) {
        $toast.info("邮箱验证码不能为空");
        return false;
    }
    if (TextUtils.isNullOrEmpty(forgotParams.value.password)) {
        $toast.info("新密码不能为空");
        return false;
    }
    if (forgotParams.value.password != forgotRepassword.value) {
        $toast.info("两次输入的密码不一致");
        return false;
    }
    if (TextUtils.isNullOrEmpty(captcha.value)) {
        $toast.info("验证码不能为空");
        return false;
    }

    return true;
}

onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer);
})

watch(() => store.showLogin, (newStatus, oldStatus) => {
    if (newStatus) {
        captchaUrl.value = request.baseUrl + "/user/user/captcha?captcha_uuid=";
        //captchaUrl.value = "http://127.0.0.1:8899/user/user/captcha?captcha_uuid=";
        toLogin();
    } else {
        captchaUrl.value = "";
    }
}, {
    deep: true // 深度监听的参数
})


</script>

<style>

</style>
