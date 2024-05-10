import {HtmlHTMLAttributes} from "react";

type Props = HtmlHTMLAttributes<SVGSVGElement> & {
  height?: number
  width?: number
}

const FooterLogoLg = ({height = 89, width = 579, ...props}: Props) => {
  if (height != 89 && width == 579) {
    width *= height / 89
  }

  if (height == 89 && width != 579) {
    height *= width / 579
  }

  return (
    <svg className="max-w-full"  width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_2247_29338)">
      <path d="M20.0357 87.6485C20.0357 87.6792 19.9563 87.6903 19.9264 87.73C19.7487 88.0068 19.2548 88.4053 18.7153 87.747C18.7055 87.7347 18.6501 87.6777 18.645 87.6485L18.5351 85.8342L18.4252 37.2152L18.8278 6.02042C18.8278 6.01216 18.7283 5.99659 18.7263 6.01312L18.6744 6.01962L18.5313 6.27318C18.369 6.60513 18.1757 6.93212 17.9646 7.24592C17.8609 7.40381 17.7399 7.55642 17.6217 7.70681C17.5605 7.78104 17.4974 7.85583 17.4324 7.92752L17.3738 7.99187L17.3702 7.99425C17.3667 7.99582 17.3726 7.99445 17.3744 7.99521L17.8081 8.04424C17.9882 8.06787 18.168 8.09504 18.3481 8.12673C18.7079 8.19032 19.0667 8.27104 19.4231 8.37284C20.134 8.57855 20.8421 8.86893 21.4885 9.31191C21.8098 9.53375 22.1153 9.79264 22.3822 10.0954C22.4196 10.137 22.4408 10.161 22.4884 10.2205C22.5431 10.289 22.5989 10.3573 22.6465 10.4274C22.7503 10.5656 22.8348 10.7079 22.9198 10.85L23.1675 11.2796L23.2292 11.3871C23.252 11.4227 23.1714 11.4357 23.1474 11.4613L22.9237 11.597L22.1039 12.1014L21.6671 12.3768L20.7981 12.9363C19.6437 13.6899 18.504 14.4683 17.3992 15.2852C16.3004 16.1038 15.2124 16.9564 14.2833 17.9012C14.0743 18.1169 13.8767 18.3386 13.7043 18.5629L13.6672 18.6121L13.6664 18.6139C13.6652 18.6156 13.6682 18.6142 13.6689 18.6148L14.369 18.6389C15.666 18.7011 16.9617 18.8416 18.2482 19.1072C19.0077 19.2655 19.7644 19.4683 20.5063 19.7462C21.6733 20.1917 22.8667 20.82 23.7246 21.9169C24.1481 22.4601 24.4481 23.1247 24.5668 23.8108C24.5975 23.9819 24.618 24.1542 24.6286 24.3257C24.6376 24.5003 24.6443 24.6568 24.6298 24.8617C24.6011 25.2514 24.4799 25.6333 24.3026 25.9603C24.0297 26.4654 23.655 26.8537 23.2693 27.1809C22.8808 27.5083 22.4715 27.7776 22.0575 28.0219C21.2282 28.5074 20.3774 28.8944 19.5289 29.2618C17.8321 29.9912 16.1256 30.6225 14.5192 31.3923C13.8653 31.7069 13.2289 32.0448 12.6425 32.4296C12.0588 32.8145 11.5197 33.2506 11.1307 33.7546C10.9378 34.0064 10.7837 34.2729 10.6858 34.5509C10.6368 34.6899 10.6009 34.8317 10.5782 34.9756C10.5546 35.1238 10.5505 35.2526 10.5492 35.4388C10.5436 36.131 10.6184 36.8 10.8891 37.2975C11.1492 37.7956 11.6434 38.1538 12.2568 38.4267C12.8672 38.6986 13.5553 38.8917 14.2512 39.0614C15.6506 39.3951 17.0984 39.6439 18.5382 39.904C22.3056 40.5645 26.0602 41.2693 29.7522 42.0972L31.1347 42.41L33.7601 43.0319L38.9856 44.3377L39.6088 44.4945L39.7629 44.533C39.8062 44.5457 39.923 44.5661 39.8034 44.5626L39.4039 44.5736L37.7832 44.6185L34.6263 44.7106C33.6382 44.7484 32.7087 44.7977 31.7796 44.8532L30.0224 44.9689C26.3409 45.2355 22.7031 45.6166 19.1412 46.1663C15.5845 46.7242 12.0834 47.4274 8.78822 48.5299C7.14903 49.0883 5.55148 49.7482 4.15094 50.64C3.45556 51.0869 2.81111 51.5964 2.30585 52.189C2.05168 52.4835 1.83836 52.8004 1.67264 53.132C1.63254 53.215 1.5928 53.2985 1.55978 53.384C1.54211 53.4241 1.52343 53.4726 1.51203 53.508L1.5134 53.5036L1.51239 53.5072C1.51103 53.5115 1.51477 53.5088 1.51694 53.508L2.44347 53.1611C3.25171 52.8682 4.06285 52.598 4.87595 52.3476C6.50241 51.8476 8.13652 51.4263 9.7728 51.0869C13.044 50.41 16.3303 50.0553 19.5552 50.1498C22.7747 50.2427 25.9426 50.8046 28.8259 51.9641C29.9457 52.4142 31.0207 52.9508 32.0304 53.5722L32.2415 53.7033L32.5958 53.936C32.8372 54.0907 33.061 54.2494 33.2819 54.4089C33.7251 54.7266 34.1132 55.0385 34.5056 55.346L35.6957 56.2831L35.7665 56.339L35.8039 56.3689C35.8121 56.3772 35.7736 56.3678 35.7606 56.3681L35.5314 56.3441L35.0702 56.2961L34.1505 56.2004C33.5359 56.1339 32.9635 56.0819 32.404 56.0429L31.1033 55.9638C30.5532 55.9358 30.0059 55.9149 29.4621 55.9007C28.3737 55.8724 27.2983 55.8708 26.2383 55.8976C24.1186 55.9527 22.0559 56.1181 20.0911 56.4559C18.1332 56.7969 16.2501 57.3049 14.6464 58.1545C14.4472 58.2616 14.253 58.3738 14.0645 58.4916L13.7818 58.6774L13.7472 58.7011L13.6809 58.7475L13.5563 58.8373L13.343 59.0015C13.0895 59.2042 12.9578 59.3338 12.9567 59.3326C12.9604 59.3358 12.5871 59.6082 12.1801 60.0638C11.7893 60.4898 11.4071 61.108 11.1798 61.6868C10.9926 62.1931 10.9124 62.5507 10.8372 62.7558C10.7672 62.9625 10.7033 63.0208 10.6429 62.9605C10.5265 62.844 10.404 62.2341 10.5185 61.4781C10.5029 61.5214 10.5332 61.2379 10.6604 60.8257C10.7813 60.4118 11.021 59.8787 11.3141 59.4299C11.738 58.768 12.2434 58.2982 12.2399 58.2975C12.2401 58.2982 12.3887 58.1604 12.6645 57.9458L12.8961 57.7734L13.0292 57.6785L13.5168 57.3619C14.2924 56.8894 15.1253 56.517 15.986 56.2102C17.7103 55.5988 19.5426 55.2346 21.4291 54.9932C23.3173 54.7554 25.2656 54.6471 27.2614 54.6302C28.2593 54.6227 29.2694 54.6376 30.2909 54.6762L31.5342 54.7349L31.1563 54.5042C30.2728 53.9785 29.3382 53.5155 28.3611 53.1245C25.6784 52.0449 22.6964 51.5019 19.6236 51.4031C16.5469 51.303 13.375 51.6299 10.1988 52.2756C8.61013 52.5996 7.01866 53.0036 5.43351 53.4848C4.64102 53.7257 3.85014 53.9856 3.06356 54.2667L2.47476 54.4817L1.80474 54.7381C1.409 54.8924 1.01422 55.0586 0.604708 55.2408C0.404199 55.3263 0.189115 55.429 0 55.5003L0.0345858 54.9393C0.060958 54.5664 0.0674403 54.2112 0.139189 53.8108C0.187746 53.6096 0.223902 53.4095 0.298831 53.2013C0.33853 53.0796 0.354474 53.03 0.377464 52.9745L0.448045 52.8036C0.645212 52.3531 0.90374 51.937 1.2014 51.5649C1.79649 50.8164 2.52195 50.2234 3.28022 49.7159C4.80678 48.7071 6.47608 48.0102 8.17308 47.4184C11.5793 46.2564 15.1367 45.5367 18.7486 44.9614C22.3642 44.3968 26.046 44.0058 29.7758 43.7326L30.9511 43.6515L29.5671 43.3377C25.8703 42.5073 22.1196 41.8023 18.3192 41.1362C16.8758 40.875 15.4259 40.6273 13.9605 40.2785C13.2282 40.0985 12.4888 39.8975 11.749 39.5703C11.3805 39.4042 11.0096 39.2028 10.6639 38.9278C10.3189 38.6557 10.0063 38.2989 9.79108 37.8954C9.35641 37.0752 9.2996 36.2131 9.29939 35.4341C9.29976 35.2498 9.30664 35.0077 9.34243 34.7889C9.37686 34.5663 9.43246 34.3468 9.50679 34.1357C9.65544 33.7126 9.88051 33.3301 10.1386 32.9933C10.6612 32.3198 11.3021 31.8176 11.9546 31.3847C12.6113 30.9539 13.2921 30.5944 13.9784 30.2639C15.6579 29.4602 17.3767 28.8257 19.0338 28.1123C19.8599 27.7553 20.675 27.3819 21.4237 26.9432C22.1609 26.5085 22.8694 25.9831 23.2005 25.3694C23.307 25.1716 23.3676 24.9712 23.3833 24.7647C23.3963 24.5558 23.3802 24.2656 23.3362 24.0309C23.2492 23.5388 23.0452 23.0818 22.735 22.6814C22.1129 21.8744 21.1178 21.3133 20.0675 20.9184C19.4026 20.6694 18.7047 20.4808 17.9944 20.3329C16.7913 20.0845 15.5521 19.9488 14.3114 19.8896L13.8459 19.8717L13.1043 19.8606C12.786 19.8594 12.4528 19.8742 12.1201 19.8833L11.9955 19.887C11.9577 19.8858 11.8935 19.9025 11.9202 19.8563L11.9517 19.6917L12.0264 19.3015C12.0682 19.0609 12.1184 18.8103 12.2503 18.542C12.3667 18.2803 12.5759 17.9854 12.7109 17.8025C12.926 17.5226 13.1533 17.2698 13.3862 17.0288C14.4081 15.9919 15.5171 15.129 16.6409 14.2892C17.7678 13.4558 18.9194 12.6685 20.0856 11.9067L21.5082 10.9975L21.474 10.9569C21.2845 10.7388 21.0635 10.5427 20.8178 10.3699C20.3259 10.0248 19.7439 9.77236 19.1313 9.59225C18.8249 9.5017 18.5099 9.42884 18.1902 9.37078C18.0306 9.34183 17.8696 9.31643 17.708 9.29438L17.4648 9.26406L17.1821 9.23551C16.4989 9.17076 15.8103 9.16798 14.8921 9.23926L13.5506 9.31957L13.006 9.35227C12.9887 9.33453 12.2941 9.45976 12.8761 9.23059L14.8011 8.26394C15.3787 7.97711 15.8217 7.75128 16.0609 7.51683C16.2115 7.3995 16.3155 7.27685 16.4464 7.15024L16.5949 6.978C16.6924 6.86124 16.7838 6.73722 16.8719 6.60985C17.0474 6.35451 17.2051 6.08143 17.3467 5.79617C17.4278 5.65602 17.7752 4.86516 17.9771 4.15941C18.0312 3.95524 18.0874 3.78376 18.1397 3.55164L18.2194 3.22014L18.2984 2.83191L18.3379 2.63741L18.3784 2.38973L18.4594 1.89162L18.5483 1.07504L18.5929 0.640723C18.6098 0.329459 18.6267 -0.111309 18.6442 0.025695L19.1467 0.0292431L19.4534 0.0314203L19.6676 0.0331943L19.7746 0.0343636H19.8281H19.8548H19.8682C19.8713 0.0343636 20.0357 0.00484998 20.0357 0.0682316V4.15586V37.0378V85.8287V87.6485Z" fill="white"/>
    </g>
    <path d="M573.402 61.767C572.09 61.767 570.888 61.5561 569.794 61.1345C568.717 60.6972 567.686 60.0335 566.702 59.1434L567.85 57.7847C568.709 58.5656 569.576 59.1512 570.45 59.5416C571.325 59.9164 572.332 60.1038 573.472 60.1038C574.581 60.1038 575.463 59.8461 576.119 59.3308C576.79 58.7998 577.126 58.1283 577.126 57.3163V57.2694C577.126 56.8946 577.064 56.5589 576.939 56.2621C576.814 55.9498 576.595 55.6687 576.283 55.4188C575.97 55.169 575.533 54.9425 574.971 54.7395C574.425 54.5365 573.722 54.3413 572.863 54.1539C571.926 53.9509 571.106 53.7166 570.403 53.4512C569.716 53.1857 569.146 52.8655 568.693 52.4908C568.241 52.116 567.905 51.6787 567.686 51.179C567.468 50.6792 567.358 50.0936 567.358 49.4221V49.3753C567.358 48.735 567.491 48.1416 567.757 47.595C568.022 47.0484 568.397 46.5799 568.881 46.1895C569.365 45.7835 569.935 45.4711 570.591 45.2525C571.247 45.0182 571.965 44.9011 572.746 44.9011C573.948 44.9011 574.994 45.0729 575.885 45.4165C576.79 45.7444 577.665 46.2441 578.508 46.9157L577.431 48.3446C576.665 47.7199 575.892 47.267 575.112 46.9859C574.346 46.7048 573.542 46.5643 572.699 46.5643C571.621 46.5643 570.77 46.822 570.146 47.3373C569.521 47.837 569.209 48.4617 569.209 49.2113V49.2581C569.209 49.6485 569.271 49.9999 569.396 50.3122C569.521 50.609 569.748 50.8901 570.075 51.1555C570.403 51.4054 570.856 51.6396 571.434 51.8583C572.012 52.0613 572.754 52.2565 573.659 52.4439C575.486 52.8499 576.829 53.4121 577.688 54.1305C578.563 54.8488 579 55.8327 579 57.082V57.1289C579 57.8316 578.859 58.4719 578.578 59.0497C578.297 59.6119 577.907 60.096 577.407 60.502C576.923 60.9081 576.337 61.2204 575.65 61.439C574.963 61.6576 574.214 61.767 573.402 61.767Z" fill="white"/>
    <path d="M552.556 61.767C551.244 61.767 550.042 61.5561 548.949 61.1345C547.871 60.6972 546.841 60.0335 545.857 59.1434L547.005 57.7847C547.863 58.5656 548.73 59.1512 549.605 59.5416C550.479 59.9164 551.486 60.1038 552.626 60.1038C553.735 60.1038 554.617 59.8461 555.273 59.3308C555.945 58.7998 556.28 58.1283 556.28 57.3163V57.2694C556.28 56.8946 556.218 56.5589 556.093 56.2621C555.968 55.9498 555.75 55.6687 555.437 55.4188C555.125 55.169 554.688 54.9425 554.125 54.7395C553.579 54.5365 552.876 54.3413 552.017 54.1539C551.08 53.9509 550.26 53.7166 549.558 53.4512C548.871 53.1857 548.301 52.8655 547.848 52.4908C547.395 52.116 547.059 51.6787 546.841 51.179C546.622 50.6792 546.513 50.0936 546.513 49.4221V49.3753C546.513 48.735 546.645 48.1416 546.911 47.595C547.176 47.0484 547.551 46.5799 548.035 46.1895C548.519 45.7835 549.089 45.4711 549.745 45.2525C550.401 45.0182 551.119 44.9011 551.9 44.9011C553.103 44.9011 554.149 45.0729 555.039 45.4165C555.945 45.7444 556.819 46.2441 557.662 46.9157L556.585 48.3446C555.82 47.7199 555.047 47.267 554.266 46.9859C553.501 46.7048 552.697 46.5643 551.853 46.5643C550.776 46.5643 549.925 46.822 549.3 47.3373C548.675 47.837 548.363 48.4617 548.363 49.2113V49.2581C548.363 49.6485 548.426 49.9999 548.551 50.3122C548.675 50.609 548.902 50.8901 549.23 51.1555C549.558 51.4054 550.011 51.6396 550.588 51.8583C551.166 52.0613 551.908 52.2565 552.814 52.4439C554.641 52.8499 555.984 53.4121 556.843 54.1305C557.717 54.8488 558.154 55.8327 558.154 57.082V57.1289C558.154 57.8316 558.014 58.4719 557.733 59.0497C557.452 59.6119 557.061 60.096 556.562 60.502C556.077 60.9081 555.492 61.2204 554.805 61.439C554.118 61.6576 553.368 61.767 552.556 61.767Z" fill="white"/>
    <path d="M525.152 45.1356H537.004V46.8221H527.002V52.4207H535.95V54.1072H527.002V59.8463H537.121V61.5329H525.152V45.1356Z" fill="white"/>
    <path d="M502.135 45.1356H509.185C510.2 45.1356 511.098 45.2839 511.879 45.5806C512.676 45.8617 513.331 46.2599 513.847 46.7753C514.253 47.1813 514.565 47.6576 514.784 48.2042C515.002 48.7508 515.112 49.352 515.112 50.0079V50.0548C515.112 50.7419 515.002 51.3587 514.784 51.9053C514.565 52.4363 514.253 52.9048 513.847 53.3108C513.456 53.7012 512.988 54.0292 512.441 54.2946C511.895 54.5445 511.301 54.7241 510.661 54.8334L515.697 61.5329H513.425L508.67 55.1614H503.985V61.5329H502.135V45.1356ZM509.021 53.4982C509.631 53.4982 510.193 53.4201 510.708 53.264C511.223 53.1078 511.668 52.8892 512.043 52.6081C512.418 52.3113 512.707 51.96 512.91 51.5539C513.128 51.1323 513.238 50.656 513.238 50.125V50.0782C513.238 49.0631 512.871 48.2745 512.137 47.7123C511.403 47.1345 510.372 46.8456 509.045 46.8456H503.985V53.4982H509.021Z" fill="white"/>
    <path d="M480.397 45.1356H486.535C487.456 45.1356 488.291 45.2605 489.041 45.5104C489.806 45.7446 490.454 46.0882 490.985 46.541C491.532 46.9783 491.945 47.5171 492.227 48.1574C492.523 48.7976 492.672 49.5238 492.672 50.3359V50.3827C492.672 51.2728 492.5 52.0537 492.156 52.7252C491.813 53.3811 491.344 53.9355 490.751 54.3883C490.173 54.8412 489.494 55.1848 488.713 55.419C487.932 55.6377 487.105 55.747 486.23 55.747H482.248V61.5329H480.397V45.1356ZM486.3 54.0604C486.972 54.0604 487.581 53.9745 488.127 53.8027C488.69 53.6309 489.166 53.3889 489.556 53.0766C489.962 52.7486 490.267 52.366 490.47 51.9287C490.688 51.4915 490.798 50.9996 490.798 50.453V50.4061C490.798 49.2349 490.392 48.3526 489.58 47.7591C488.783 47.1501 487.721 46.8456 486.394 46.8456H482.248V54.0604H486.3Z" fill="white"/>
    <path d="M448.376 55.0442L441.559 45.1356H443.808L449.336 53.3342L454.911 45.1356H457.066L450.249 55.0208V61.5329H448.376V55.0442Z" fill="white"/>
    <path d="M426.3 46.8456H420.795V45.1356H433.679V46.8456H428.174V61.5329H426.3V46.8456Z" fill="white"/>
    <path d="M409.224 45.1356H411.075V61.5329H409.224V45.1356Z" fill="white"/>
    <path d="M393.608 61.767C392.297 61.767 391.094 61.5561 390.001 61.1345C388.924 60.6972 387.893 60.0335 386.909 59.1434L388.057 57.7847C388.916 58.5656 389.782 59.1512 390.657 59.5416C391.531 59.9164 392.539 60.1038 393.679 60.1038C394.787 60.1038 395.67 59.8461 396.326 59.3308C396.997 58.7998 397.333 58.1283 397.333 57.3163V57.2694C397.333 56.8946 397.27 56.5589 397.145 56.2621C397.02 55.9498 396.802 55.6687 396.49 55.4188C396.177 55.169 395.74 54.9425 395.178 54.7395C394.631 54.5365 393.928 54.3413 393.07 54.1539C392.133 53.9509 391.313 53.7166 390.61 53.4512C389.923 53.1857 389.353 52.8655 388.9 52.4908C388.447 52.116 388.112 51.6787 387.893 51.179C387.674 50.6792 387.565 50.0936 387.565 49.4221V49.3753C387.565 48.735 387.698 48.1416 387.963 47.595C388.229 47.0484 388.603 46.5799 389.088 46.1895C389.572 45.7835 390.142 45.4711 390.797 45.2525C391.453 45.0182 392.172 44.9011 392.952 44.9011C394.155 44.9011 395.201 45.0729 396.091 45.4165C396.997 45.7444 397.872 46.2441 398.715 46.9157L397.637 48.3446C396.872 47.7199 396.099 47.267 395.318 46.9859C394.553 46.7048 393.749 46.5643 392.906 46.5643C391.828 46.5643 390.977 46.822 390.352 47.3373C389.728 47.837 389.415 48.4617 389.415 49.2113V49.2581C389.415 49.6485 389.478 49.9999 389.603 50.3122C389.728 50.609 389.954 50.8901 390.282 51.1555C390.61 51.4054 391.063 51.6396 391.641 51.8583C392.219 52.0613 392.96 52.2565 393.866 52.4439C395.693 52.8499 397.036 53.4121 397.895 54.1305C398.769 54.8488 399.207 55.8327 399.207 57.082V57.1289C399.207 57.8316 399.066 58.4719 398.785 59.0497C398.504 59.6119 398.114 60.096 397.614 60.502C397.13 60.9081 396.544 61.2204 395.857 61.439C395.17 61.6576 394.42 61.767 393.608 61.767Z" fill="white"/>
    <path d="M364.97 45.1356H372.02C373.035 45.1356 373.933 45.2839 374.714 45.5806C375.51 45.8617 376.166 46.2599 376.682 46.7753C377.088 47.1813 377.4 47.6576 377.619 48.2042C377.837 48.7508 377.946 49.352 377.946 50.0079V50.0548C377.946 50.7419 377.837 51.3587 377.619 51.9053C377.4 52.4363 377.088 52.9048 376.682 53.3108C376.291 53.7012 375.823 54.0292 375.276 54.2946C374.73 54.5445 374.136 54.7241 373.496 54.8334L378.532 61.5329H376.26L371.505 55.1614H366.82V61.5329H364.97V45.1356ZM371.856 53.4982C372.465 53.4982 373.027 53.4201 373.543 53.264C374.058 53.1078 374.503 52.8892 374.878 52.6081C375.253 52.3113 375.542 51.96 375.745 51.5539C375.963 51.1323 376.073 50.656 376.073 50.125V50.0782C376.073 49.0631 375.706 48.2745 374.972 47.7123C374.238 47.1345 373.207 46.8456 371.88 46.8456H366.82V53.4982H371.856Z" fill="white"/>
    <path d="M343.187 45.1356H355.04V46.8221H345.038V52.4207H353.986V54.1072H345.038V59.8463H355.157V61.5329H343.187V45.1356Z" fill="white"/>
    <path d="M318.123 45.1356H320.184L326.017 59.2607L331.873 45.1356H333.864L326.813 61.65H325.174L318.123 45.1356Z" fill="white"/>
    <path d="M306.785 45.1356H308.636V61.5329H306.785V45.1356Z" fill="white"/>
    <path d="M282.026 45.1356H283.759L294.089 58.2769V45.1356H295.893V61.5329H294.417L283.829 48.0871V61.5329H282.026V45.1356Z" fill="white"/>
    <path d="M264.72 61.7906C263.705 61.7906 262.776 61.6422 261.933 61.3455C261.105 61.0332 260.387 60.5803 259.778 59.9869C259.184 59.3778 258.724 58.6282 258.396 57.7381C258.068 56.8479 257.904 55.8251 257.904 54.6694V45.1356H259.754V54.5523C259.754 56.3326 260.199 57.699 261.089 58.6517C261.98 59.6043 263.205 60.0806 264.767 60.0806C266.282 60.0806 267.484 59.6277 268.374 58.7219C269.264 57.8162 269.709 56.4653 269.709 54.6694V45.1356H271.56V54.5289C271.56 55.7314 271.396 56.7855 271.068 57.6912C270.74 58.597 270.272 59.3544 269.663 59.9634C269.069 60.5725 268.351 61.0332 267.508 61.3455C266.68 61.6422 265.751 61.7906 264.72 61.7906Z" fill="white"/>
    <path d="M220.635 45.1356H226.327C227.607 45.1356 228.778 45.3464 229.84 45.768C230.918 46.1741 231.839 46.7441 232.604 47.478C233.385 48.212 233.986 49.0787 234.408 50.0782C234.83 51.062 235.04 52.1318 235.04 53.2874V53.3342C235.04 54.4899 234.83 55.5674 234.408 56.5668C233.986 57.5663 233.385 58.433 232.604 59.167C231.839 59.901 230.918 60.4788 229.84 60.9004C228.778 61.3221 227.607 61.5329 226.327 61.5329H220.635V45.1356ZM222.485 46.8456V59.8229H226.327C227.357 59.8229 228.294 59.6589 229.138 59.331C229.981 59.003 230.691 58.5501 231.269 57.9723C231.863 57.3945 232.315 56.7152 232.628 55.9344C232.956 55.1379 233.12 54.2868 233.12 53.3811V53.3342C233.12 52.4285 232.956 51.5852 232.628 50.8044C232.315 50.0079 231.863 49.3208 231.269 48.743C230.691 48.1495 229.981 47.6889 229.138 47.3609C228.294 47.0173 227.357 46.8456 226.327 46.8456H222.485Z" fill="white"/>
    <path d="M197.618 45.1356H204.668C205.683 45.1356 206.581 45.2839 207.362 45.5806C208.158 45.8617 208.814 46.2599 209.33 46.7753C209.736 47.1813 210.048 47.6576 210.267 48.2042C210.485 48.7508 210.594 49.352 210.594 50.0079V50.0548C210.594 50.7419 210.485 51.3587 210.267 51.9053C210.048 52.4363 209.736 52.9048 209.33 53.3108C208.939 53.7012 208.471 54.0292 207.924 54.2946C207.378 54.5445 206.784 54.7241 206.144 54.8334L211.18 61.5329H208.908L204.153 55.1614H199.468V61.5329H197.618V45.1356ZM204.504 53.4982C205.113 53.4982 205.675 53.4201 206.191 53.264C206.706 53.1078 207.151 52.8892 207.526 52.6081C207.901 52.3113 208.19 51.96 208.393 51.5539C208.611 51.1323 208.721 50.656 208.721 50.125V50.0782C208.721 49.0631 208.354 48.2745 207.62 47.7123C206.886 47.1345 205.855 46.8456 204.528 46.8456H199.468V53.4982H204.504Z" fill="white"/>
    <path d="M179.239 61.8141C177.989 61.8141 176.849 61.5877 175.819 61.1348C174.804 60.682 173.929 60.0729 173.195 59.3077C172.461 58.5269 171.891 57.6289 171.485 56.6138C171.095 55.5832 170.9 54.5056 170.9 53.3812V53.3344C170.9 52.21 171.103 51.1325 171.509 50.1018C171.915 49.0711 172.485 48.1731 173.219 47.4079C173.953 46.6271 174.835 46.0102 175.866 45.5574C176.896 45.0889 178.036 44.8546 179.285 44.8546C180.535 44.8546 181.667 45.0811 182.682 45.5339C183.713 45.9868 184.595 46.6037 185.329 47.3845C186.063 48.1497 186.625 49.0476 187.015 50.0783C187.421 51.0934 187.624 52.1631 187.624 53.2875V53.3344C187.624 54.4588 187.421 55.5363 187.015 56.567C186.609 57.5977 186.039 58.5034 185.305 59.2843C184.571 60.0495 183.689 60.6663 182.658 61.1348C181.628 61.5877 180.488 61.8141 179.239 61.8141ZM179.285 60.1041C180.222 60.1041 181.081 59.9324 181.862 59.5888C182.658 59.2296 183.338 58.7455 183.9 58.1365C184.462 57.5274 184.899 56.8169 185.212 56.0048C185.54 55.1927 185.704 54.3182 185.704 53.3812V53.3344C185.704 52.3974 185.54 51.5229 185.212 50.7108C184.899 49.8831 184.454 49.1648 183.877 48.5557C183.299 47.9467 182.612 47.4626 181.815 47.1034C181.034 46.7442 180.176 46.5646 179.239 46.5646C178.302 46.5646 177.435 46.7442 176.639 47.1034C175.858 47.447 175.186 47.9233 174.624 48.5323C174.062 49.1413 173.617 49.8519 173.289 50.664C172.977 51.476 172.82 52.3505 172.82 53.2875V53.3344C172.82 54.2714 172.977 55.1537 173.289 55.9814C173.617 56.7934 174.07 57.504 174.647 58.113C175.225 58.7221 175.905 59.2062 176.685 59.5654C177.482 59.9245 178.348 60.1041 179.285 60.1041Z" fill="white"/>
    <path d="M150.507 45.1356H162.29V46.8456H152.358V52.7018H161.236V54.3883H152.358V61.5329H150.507V45.1356Z" fill="white"/>
    <path d="M125.91 45.1356H127.644L137.974 58.2769V45.1356H139.777V61.5329H138.302L127.714 48.0871V61.5329H125.91V45.1356Z" fill="white"/>
    <path d="M107.382 45.0192H109.115L116.587 61.5337H114.596L112.675 57.2001H103.751L101.807 61.5337H99.9093L107.382 45.0192ZM111.949 55.5135L108.225 47.1743L104.477 55.5135H111.949Z" fill="white"/>
    <path d="M84.369 46.8456H78.8644V45.1356H91.7476V46.8456H86.2429V61.5329H84.369V46.8456Z" fill="white"/>
    <path d="M64.9269 61.767C63.6152 61.767 62.4127 61.5561 61.3196 61.1345C60.2421 60.6972 59.2115 60.0335 58.2277 59.1434L59.3754 57.7847C60.2343 58.5656 61.101 59.1512 61.9755 59.5416C62.85 59.9164 63.8572 60.1038 64.9972 60.1038C66.1059 60.1038 66.9882 59.8461 67.6441 59.3308C68.3156 58.7998 68.6513 58.1283 68.6513 57.3163V57.2694C68.6513 56.8946 68.5889 56.5589 68.4639 56.2621C68.339 55.9498 68.1204 55.6687 67.8081 55.4188C67.4958 55.169 67.0585 54.9425 66.4963 54.7395C65.9498 54.5365 65.247 54.3413 64.3882 54.1539C63.4512 53.9509 62.6314 53.7166 61.9287 53.4512C61.2415 53.1857 60.6716 52.8655 60.2187 52.4908C59.7658 52.116 59.4301 51.6787 59.2115 51.179C58.9928 50.6792 58.8835 50.0936 58.8835 49.4221V49.3753C58.8835 48.735 59.0163 48.1416 59.2817 47.595C59.5472 47.0484 59.922 46.5799 60.4061 46.1895C60.8902 45.7835 61.4602 45.4711 62.116 45.2525C62.7719 45.0182 63.4902 44.9011 64.271 44.9011C65.4735 44.9011 66.5198 45.0729 67.4099 45.4165C68.3156 45.7444 69.1901 46.2441 70.0334 46.9157L68.9558 48.3446C68.1907 47.7199 67.4177 47.267 66.6369 46.9859C65.8717 46.7048 65.0675 46.5643 64.2242 46.5643C63.1467 46.5643 62.2956 46.822 61.671 47.3373C61.0463 47.837 60.734 48.4617 60.734 49.2113V49.2581C60.734 49.6485 60.7965 49.9999 60.9214 50.3122C61.0463 50.609 61.2728 50.8901 61.6007 51.1555C61.9287 51.4054 62.3815 51.6396 62.9593 51.8583C63.5371 52.0613 64.2789 52.2565 65.1846 52.4439C67.0117 52.8499 68.3546 53.4121 69.2135 54.1305C70.088 54.8488 70.5253 55.8327 70.5253 57.082V57.1289C70.5253 57.8316 70.3847 58.4719 70.1036 59.0497C69.8225 59.6119 69.4321 60.096 68.9324 60.502C68.4483 60.9081 67.8627 61.2204 67.1756 61.439C66.4885 61.6576 65.739 61.767 64.9269 61.767Z" fill="white"/>
    <defs>
    <clipPath id="clip0_2247_29338">
    <rect width="39.8557" height="88.1051" fill="white"/>
    </clipPath>
    </defs>
    </svg>
  )
}

export default FooterLogoLg;