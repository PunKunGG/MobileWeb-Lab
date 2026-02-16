<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>About</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>System Architecture</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ol>
            <li>User เลือกรูปจากหน้าเว็บ</li>
            <li>PhotoService แปลงรูปเป็น base64</li>
            <li>GeminiService ส่งรูปไป Firebase AI Logic</li>
            <li>Gemini 2.5 Flash วิเคราะห์ภาพ</li>
            <li>ผลลัพธ์ JSON ถูกส่งกลับมาแสดงบน UI</li>
          </ol>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Tech Stack</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ul>
            <li>Ionic + Vue</li>
            <li>Firebase AI Logic</li>
            <li>Gemini 2.5 Flash</li>
          </ul>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
