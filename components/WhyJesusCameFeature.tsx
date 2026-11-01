'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
export default function WhyJesusCameFeature(){
 const {language}=useLanguage();const ru=language==='ru';
 return <section aria-label={ru?'Новая история':'Featured story'} style={{padding:'24px 16px',background:'#f4f1e5'}}><Link href="/lessons/why-did-jesus-come" style={{display:'block',position:'relative',overflow:'hidden',borderRadius:26,maxWidth:1000,minHeight:330,margin:'auto',color:'#fff',textDecoration:'none',background:'#193b37'}}>
 <img src="/images/lessons/why-did-jesus-come/cover.webp" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 54%'}}/>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(8,31,28,.95),rgba(8,31,28,.77) 48%,rgba(8,31,28,.12))'}}/>
 <div style={{position:'relative',padding:'clamp(24px,5vw,44px)',maxWidth:640}}><p style={{color:'#ffe19a',fontWeight:900,marginBottom:12}}>{ru?'История • 5 головоломок • 1 Иоанна':'Story • 5 puzzles • 1 John'}</p><h2 style={{fontFamily:'var(--font-nunito)',fontSize:'clamp(1.9rem,5vw,3rem)',lineHeight:1.15,color:'white',fontWeight:900,marginBottom:18}}>{ru?'Зачем приходил Иисус?':'Why Did Jesus Come?'}</h2><p style={{fontSize:18,lineHeight:1.65,marginBottom:22,color:'white'}}>{ru?'Открой с Мишей и Рози радость общения с Богом, прощение и обещание вечной жизни.':'Discover joy with God, forgiveness, and the promise of eternal life with Michael and Rosie.'}</p><span style={{display:'inline-block',padding:'12px 20px',borderRadius:14,background:'#ffe19a',color:'#193b37',fontWeight:900}}>{ru?'Открыть историю':'Explore the story'} →</span></div>
 </Link></section>;
}
