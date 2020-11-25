<template>
	<div class="faq-box">
		<div class="title">Frequently Asked Questions</div>
		<el-collapse v-model="activeNames">
			<el-collapse-item title="1.what is Amz-Buy？" name="1">
				<div>Amz-Buy is a discount platform for Amazon products,we collect the latest deals to help buyers save money.
					Every user can choose the products they would like to buy and purchase them on Amazon at the lowest price.</div>
			</el-collapse-item>
			<el-collapse-item title="2.How do I get discounted deals?" name="2">
				<div>There are 4 easy steps to get any discounts</div>
				<div>Step ① Create a Amz-Buy buyer account and complete your information.</div>
				<div>Step ② Apply for the transaction request and contact the seller or wait for the seller's approval.</div>
				<div>Step ③ After the seller approves your transaction request, buy the item on Amazon and upload your order
					information.</div>
				<div>Step ④ Seller confirms your order information and refunds the order money to your PayPal account accordingly.</div>
			</el-collapse-item>
			<el-collapse-item title="3.Why did my transaction request fail?" name="3">
				<div>①The number of product requests has reached the limit set by the system.</div>
				<div>②Your available points are not enough to claim the deal.</div>
			</el-collapse-item>
			<el-collapse-item title="4.Which Amazon market do support?" name="4">
				<div>Support US, ES, DE, UK, IT, JP, FR, MX, CA. The United States site has the most traffic, followed by
					Germany, the United Kingdom, Spain, and other European countries.</div>
			</el-collapse-item>
			<el-collapse-item title="5.When will my money be to my account?" name="5">
				<div>Usually, after the seller confirms that your order is valid, you will receive a refund to your PayPal account.
					You can check the refund status under My Deals.</div>
			</el-collapse-item>
			<el-collapse-item title="6.Will you cover fee charged by PayPal?" name="6">
				<div>No, we don't pay PayPal. Besides, the customer may pay taxes and additional shipping costs on Amazon. You can
					negotiate with the seller about who will bear the transaction fees!</div>
			</el-collapse-item>
			<el-collapse-item title="7.What payment methods do support?" name="7">
				<div>We currently only support refunds for PayPal accounts. Only a small number of merchants will refund the
					discount volume or gift card at the request of the buyer.</div>
			</el-collapse-item>
			<el-collapse-item title="8.Can the business access my information?" name="8">
				<div>Currently, we will only reveal your PayPal account and Amazon profile to sellers after you have made a
					purchase and uploaded your order info.</div>
			</el-collapse-item>
			<el-collapse-item title="9.Why was my account suspended?" name="9">
				<div>The reasons why we suspend your account may be as follows:</div>
				<div>①You have submitted the Amazon order and requested a refund on our site, but you still have requested a
					refund on Amazon.</div>
				<div>②Register multiple accounts to earn points by fraud.If your account does not have these behaviors during use,
					please feel free to contact us.</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
	export default {
		name: 'faq',
		data() {
			return {
				activeNames: ['1', '2', '3', '4']
			}
		}
	}
</script>
