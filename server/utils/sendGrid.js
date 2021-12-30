
const sgMail = require('@sendgrid/mail');
const sendGrid = {};
const dotenv = require('dotenv');
dotenv.config();

sendGrid.sendMailBienvenida = async(user, empresa, link ) => {
    try{
        //sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey('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');
        const msg = {
          to: user,
          from: 'support@ccondominium.com.mx',
          templateId: 'd-d396c0ca49cf432f8a76f7fcfd58e297',
          dynamic_template_data: {
            user: user,
            empresa: empresa,
            link: link}
        };
        var ss = await sgMail.send(msg);
        if(ss != null) return true;
    }catch(e){
        return false;
    }
    return false;
}

sendGrid.sendMailResetPass = async(user, pass, link ) => {
    try{
        //sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey('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');
        const msg = {
          to: user,
          from: 'support@ccondominium.com.mx',
          templateId: 'd-b8006a346b3e49078ff99b879d214195',
          dynamic_template_data: {
            user: user,
            pass: pass,
            link: link}
        };
        var ss = await sgMail.send(msg);
        if(ss != null) return true;
    }catch(e){
        return false;
    }
    return false;
}

sendGrid.sendMailMensaje = async(user, mensaje, link ) => {
    try{
        console.log('sendGrid');
        console.log(process.env.SENDGRID_API_KEY);
        //sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey('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');
        const msg = {
          to: user,
          from: 'support@ccondominium.com.mx',
          templateId: 'd-0ff2eb693ac9428d8e585f4e77674d00',
          dynamic_template_data: {
            user: user,
            mensaje: mensaje,
            link: link}
        };
        var ss = await sgMail.send(msg);
        if(ss != null) return true;
    }catch(e){
        return false;
    }
    return false;
}

sendGrid.sendMailAviso = async(users, mensaje, link ) => {
    try{
        //sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey('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');
        var aUsers = new Array();
        users.forEach(u => aUsers.push(u.user));
        const msg = {
          to: aUsers,
          from: 'support@ccondominium.com.mx',
          templateId: 'd-a54e68012303473f9014f193825f5bb9',
          dynamic_template_data: {
            user: 'Residente',
            mensaje: mensaje,
            link: link}
        };
        var ss = await sgMail.sendMultiple(msg);
        if(ss != null) return true;
    }catch(e){
        return false;
    }
    return false;
}

sendGrid.sendMailEvento = async(users, fecha, evento, link ) => {
    try{
        //sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey('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');
        var aUsers = new Array();
        users.forEach(u => aUsers.push(u.user));
        const msg = {
          to: aUsers,
          from: 'support@ccondominium.com.mx',
          templateId: 'd-f0f16ff4e207435b9c0ce8132c0dcfe3',
          dynamic_template_data: {
            user: 'Residente',
            fecha: fecha,
            evento: evento,
            link: link}
        };
        var ss = await sgMail.sendMultiple(msg);
        if(ss != null) return true;
    }catch(e){
        return false;
    }
    return false;
}
module.exports = sendGrid;
