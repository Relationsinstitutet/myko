/// <reference types="@sveltejs/kit" />

import type IUserData from '$lib/auth/userdata';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  declare namespace App {
    interface Locals {
      user: ?IUserData;
    }
    // interface Platform {}
    // interface Session {}
    // interface Stuff {}
  }
}
